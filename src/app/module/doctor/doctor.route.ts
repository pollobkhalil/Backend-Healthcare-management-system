import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { DoctorController } from "./doctor.controller";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

// Doctor routes
router.get("/my-profile", checkAuth(Role.DOCTOR), DoctorController.getMyProfile);
router.get("/my-appointments", checkAuth(Role.DOCTOR), DoctorController.getMyAppointments);
router.get("/my-schedules", checkAuth(Role.DOCTOR), DoctorController.getMySchedules);   

// Admin routes 
router.get("/", DoctorController.getAllDoctors);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.getDoctorById);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDoctorZodSchema), DoctorController.updateDoctor);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.deleteDoctor);

export const DoctorRoutes = router;