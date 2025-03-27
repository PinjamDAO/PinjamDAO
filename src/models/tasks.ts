import mongoose from "mongoose";

export enum TaskType {
    DepositUSDC = 'DepositUSDC',
    PayLoan = 'PayLoan',
    GetLoan = 'GetLoan',
    WithdrawETH = 'WithdrawETH',
    WithdrawDeposit = 'WithdrawDeposit'
}

export enum TaskProgress {
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
    Cooldown = 'Cooldown',
    Saving = 'Saving',
    WithdrawDeposit = 'WithdrawDeposit',

    Done = 'Done',
    Failed = 'Failed',
    Started = 'Started',
}

export type taskType = {
    userId: string,
    taskType: TaskType
    progress: TaskProgress
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