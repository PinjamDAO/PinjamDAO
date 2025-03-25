import mongoose from "mongoose";

export enum TaskType {
    SendUSDC = 'SendUSDC',
    PayLoan = 'PayLoan',
    GetLoan = 'GetLoan',
    WithdrawETH = 'WithdrawETH',
}

export enum TaskProgress {
    Done = 'Done',
    ETHToMainWallet = 'ETHToMainWallet',
    ETHToBlockchain = 'ETHToBlockchain',
    DepositCollateral = 'DepositCollateral',
    SendingLoan = 'SendingLoan',
    USDCToBlockchain = 'USDCToBlockchain',
    USDCToMainWallet = 'USDCToMainWallet',
    USDCToUserWallet = 'USDCToUserWallet',
    RepayingLoan = 'RepayingLoan',
    RepayingCollateral = 'RepayingCollateral',
    WithdrawUSDC = 'WithdrawUSDC',
    RefundingCollateral = 'RefundingCollateral',
    Failed = 'Failed',
    Started = 'Started',
}

const taskSchema = new mongoose.Schema({
    userId: String,
    taskType: {
        type: String,
        enum: TaskType,
    },
    progress: {
        type: String,
        enum: TaskProgress,
        default: TaskProgress.Started
    },
})

export async function updateTaskState(task: any, progress: TaskProgress) {
    task.progress = progress
    await task.save()
}

export default mongoose.models.Task || mongoose.model('Task', taskSchema)