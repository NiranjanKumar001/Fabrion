import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
  

function SignInDialog({openDialog, closeDialog}) {
    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription >
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h2 className='font-bold text-center text-2xl text-white'>{Lookup.SIGNIN_HEADING}</h2>
                            <p mt-2 text-center>{Lookup.SIGNIN_SUBHEADING}</p>
                            <Button className='bg-blue-500 text-white hover:bg-blue-400 mt-3'>Sign In With Google</Button>
                            <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default SignInDialog