import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Project } from "../models/Project.js";
import { createError, ErrorMessages } from "../utils/errors.js";

const PAGE_SIZE = 10;

export const createProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user?.userId,
    });

    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    throw error;
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    const showDeleted = req.query.showDeleted === "true";

    const query: Record<string, unknown> = showDeleted
      ? { isDeleted: true }
      : { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "ALL" && !showDeleted) {
      query.status = status;
    }

    const skip = (page - 1) * PAGE_SIZE;

    const projects = await Project.find(query)
      .populate("createdBy", "name email")
      .limit(PAGE_SIZE)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      status: "success",
      data: {
        projects,
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          total,
          pages: Math.ceil(total / PAGE_SIZE),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
export const getProjectById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      isDeleted: false,
    }).populate("createdBy", "name email");

    if (!project) {
      throw createError(404, ErrorMessages.PROJECT_NOT_FOUND);
    }

    res.json({
      status: "success",
      data: { project },
    });
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    console.log("Received body:", req.body); // Better logging

    const project = await Project.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!project) {
      throw createError(404, ErrorMessages.PROJECT_NOT_FOUND);
    }

    // Update only provided fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();

    res.json({
      status: "success",
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!project) {
      throw createError(404, ErrorMessages.PROJECT_NOT_FOUND);
    }

    // Soft delete
    project.isDeleted = true;
    project.status = "DELETED";
    await project.save();

    res.json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

// Restore deleted project
export const restoreProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const project = await Project.findOne({
      _id: id,
      isDeleted: true,
    });

    if (!project) {
      throw createError(404, "Deleted project not found");
    }

    project.isDeleted = false;
    project.status = "ACTIVE";
    await project.save();

    res.json({
      status: "success",
      message: "Project restored successfully",
      data: { project },
    });
  } catch (error) {
    throw error;
  }
};

// Permanently delete project
export const permanentDeleteProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      isDeleted: true,
    });

    if (!project) {
      throw createError(404, "Deleted project not found");
    }

    res.json({
      status: "success",
      message: "Project permanently deleted",
    });
  } catch (error) {
    throw error;
  }
};
export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject,
};
