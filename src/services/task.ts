import Task, { TaskProgress, TaskType } from "@/models/tasks";
import connectDB from "./db";

export async function checkOngoingTasks(type: TaskType) {
    await connectDB()

    return (await Task.find({
        taskType: type,
        progress: {
            '$nin': [TaskProgress.Done, TaskProgress.Failed]
        }
    }).countDocuments().exec()) > 0
}