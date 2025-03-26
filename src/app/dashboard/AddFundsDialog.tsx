import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "motion/react";
import { useQRCode } from 'next-qrcode';

export default function AddFundsDialog({ walletAddress, onOpenChange }: { walletAddress: string | undefined, onOpenChange: () => void }) {

  const { Canvas } = useQRCode()

  return(
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>
        <motion.div
          className="flex justify-center w-12 h-12 bg-[#5202DB] rounded-full text-white font-semibold
          text-4xl text-center cursor-pointer select-none"
          whileHover={{
            scale: 1.1
          }}
          whileTap={{
            scale: 0.9
          }}
        >
          +
        </motion.div>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center space-y-2 bg-[#EFF8FC]">
        <DialogHeader>
          <DialogTitle className="font-bold text-4xl text-black pt-5">Add money</DialogTitle>
        </DialogHeader>
        {
          walletAddress !== undefined ? <Canvas
          text={walletAddress}
          options={{
            errorCorrectionLevel: 'M',
            margin: 1,
            scale: 8,
            width: 400,
            color: {
              dark: '#5202DB',
              light: '#EFF8FC',
            },
          }}
        /> : "Loading..."
        }
        
        <div className="font-semibold text-xl px-10 text-center">Scan the QR Code with your crypto wallet such as Metamask.</div>
      </DialogContent>
    </Dialog>
  )

}