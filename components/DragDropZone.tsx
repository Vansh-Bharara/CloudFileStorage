"use client"
import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function DragDropZone() {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }, [])

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    console.log(fileRejections)
    if(fileRejections.length>0){
      const tooManyFiles = fileRejections.find((fileRejection)=>fileRejection.errors[0].code === "too-many-files")
      
      const fileTooLarge = fileRejections.find((fileRejection)=>fileRejection.errors[0].code === "file-too-large") 

      if(tooManyFiles){
        console.log("reached too many files , now u should see toast")
        toast("You can only upload 5 files")
        console.log("saw ????")
      }
      if(fileTooLarge){
        toast.error('File size is large , should be less than 5mb')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop,
    onDropRejected,
    maxFiles:5,
    maxSize:1024*1024*5,
    accept:{
      "image/*":[],
    }
   })

  return (
    <Card className={cn(
      "relative border-2 border-dashed transition-color duration-200 ease-in-out w-full h-64",
      isDragActive?'border-primary bg-primary/10 border-solid':'border-border hover:border-primary'
    )} {...getRootProps()}>
      <CardContent className='flex flex-col items-center justify-center h-full'>
        <input {...getInputProps()} />
        {
          isDragActive ?(
            <p>Drop the files here ...</p>) :
            (
              <div className='flex flex-col items-center justify-center h-full w-full'>
                <p>Drag 'n' drop some files here, or click to select files</p>
                <Button>Select Files</Button>
              </div>
            )
        }
      </CardContent>
    </Card>
  )
}