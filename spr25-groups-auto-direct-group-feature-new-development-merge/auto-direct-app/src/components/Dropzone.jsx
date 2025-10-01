import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactSortable } from 'react-sortablejs';

function Dropzone({ className, files, setFiles }) {
  //const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          id: `${file.name}-${Date.now()}-${index}`, // unique id for sorting
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((previousFiles) => [...previousFiles, ...newFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 1024 * 4000,
    maxFiles: 10,
  });

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div>
      {/* Drop Area */}
      <div
        {...getRootProps({ className })}
        className="bg-gray-100 border-2 border-gray-400 p-6 text-center rounded-md cursor-pointer"
      >
        <input {...getInputProps()} />
        <img src="/public/assets/upload-icon.png" width="50" height="50" className="mx-auto"/>
        <br></br>
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag or click to upload images</p>
        )}
      </div>
      {fileRejections.length > 0 && (
        <ul className="mt-2 text-sm text-red-600">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.path}>
              {file.name} - {errors.map(e => e.message).join(', ')}
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center">
        <div className="w-full">
            {files.length > 0 && (
            <p className="text-sm text-gray-600 text-center mt-4">
                Rearrange the image order by dragging them as required.
            </p>
            )}
            {/* Sortable Preview List */}
            <ReactSortable
                list={files}
                setList={setFiles}
                animation={150}
                className="flex flex-wrap gap-x-4 gap-y-10 mt-6 mb-6 justify-center"
            >   
                {files.map((file, index) => (
                <div
                    key={file.id}
                    className="relative rounded-md shadow-lg w-32 h-32 bg-white border border-gray-300"
                >
                    {/* Position Number Badge */}
                    <div className="absolute top-1 left-1 bg-black text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                    {index + 1}
                    </div>                
                    <img
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                    className="h-full w-full object-contain rounded-md"
                    />
                    {/* Button for the remove */}
                    <button
                    type="button"
                    className="w-7 h-7 flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                    onClick={() => removeFile(file.id)}
                    >
                    <img
                        src="/public/assets/remove-icon.png"
                        alt="Remove"
                        className="w-5 h-5"
                    />
                    </button>
                </div>
                ))}
            </ReactSortable>
        </div>
      </div>
    </div>
  );
}

export default Dropzone;

