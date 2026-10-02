import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";

const getAllDoctors = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const result = await DoctorService.getAllDoctors(query as IQueryParams);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctors fetched successfully",
            data: result.data,
            meta: result.meta,
        })
    }
)

const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const doctor = await DoctorService.getDoctorById(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        })
    }
)

const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedDoctor = await DoctorService.updateDoctor(id as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor updated successfully",
            data: updatedDoctor,
        })
    }
)

const deleteDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await DoctorService.deleteDoctor(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor deleted successfully",
            data: result,
        })
    }
)


const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await DoctorService.getMyProfile(userId);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Profile fetched successfully", data: result });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await DoctorService.getMyAppointments(userId);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Appointments fetched successfully", data: result });
});

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await DoctorService.getMySchedules(userId);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Schedules fetched successfully", data: result });
});




export const DoctorController = {
    getMyProfile,
    getMyAppointments,
    getMySchedules,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};