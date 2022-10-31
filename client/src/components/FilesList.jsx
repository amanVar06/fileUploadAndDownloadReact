import { useState, useEffect, useRef } from "react";
import download from "downloadjs";
import axios from "axios";
import { API_URL } from "../utils/constants";

// Import Worker
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FilesList = ({ previewSrc, pdfFile, setPdfFile, setPreviewSrc }) => {
  // creating new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState(false);
  // const [file, setFile] = useState(null);

  // console.log(previewSrc);
  // console.log(file);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          setPreview(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/getAllFiles`);
        setErrorMsg("");
        setFilesList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };

    getFilesList();
  }, []);

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`);
      const split = path.split("/");
      const filename = split[split.length - 1];
      setErrorMsg("");
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while downloading file. Try again later");
      }
    }
  };

  // const getSingleFile = async (id, path, mimetype) => {
  //   try {
  //     const result = await axios.get(`${API_URL}/getFile/${id}`, {
  //       responseType: "blob",
  //     });
  //     const split = path.split("/");
  //     const filename = split[split.length - 1];
  //     setErrorMsg("");
  //     return download(result.data, filename, mimetype);
  //   } catch (error) {
  //     if (error.response && error.response.status === 400) {
  //       setErrorMsg("Error while downloading file. Try again later");
  //     }
  //   }
  // };

  const handlePreview = async (e, id) => {
    // setPreviewSrc("");
    e.preventDefault();
    setPreview(true);
    const requireFile = filesList.find((file) => file._id === id);
    console.log(requireFile);
    // if (requireFile.match(/\.(pdf)$/)) {
    //   setPdfFile(true);
    // }
    // setPreviewSrc(requireFile.src);
    // try {
    //   const result = await axios.get(`${API_URL}/getFile/${id}`);
    //   setErrorMsg("");
    //   setFile(result);
    //   console.log(result);
    // } catch (error) {
    //   if (error.response && error.response.status === 400) {
    //     setErrorMsg("Error while downloading file. Try again later");
    //   }
    // }
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div ref={wrapperRef} className="files-container">
      {preview ? (
        <div className="image-preview">
          {!pdfFile ? (
            <img className="preview-image" src={previewSrc} alt="Preview" />
          ) : (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
              <Viewer
                fileUrl={previewSrc}
                plugins={[defaultLayoutPluginInstance]}
              ></Viewer>
            </Worker>
          )}
        </div>
      ) : (
        <div>
          {errorMsg && <p className="errorMsg">{errorMsg}</p>}
          <table className="files-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Download File</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {filesList.length > 0 ? (
                filesList.map(
                  ({
                    _id,
                    title,
                    description,
                    file_path,
                    file_mimetype,
                    src,
                  }) => {
                    // console.log(file_mimetype);
                    // console.log(typeof file_mimetype);
                    return (
                      <tr key={_id}>
                        <td className="file-title">{title}</td>
                        <td className="file-description">{description}</td>
                        <td>
                          <a
                            href="#/"
                            onClick={() =>
                              downloadFile(_id, file_path, file_mimetype)
                            }
                          >
                            Download
                          </a>
                        </td>
                        <td>
                          <a
                            href="#/"
                            onClick={(e) => {
                              handlePreview(e, _id);
                            }}
                          >
                            Preview
                          </a>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={3} style={{ fontWeight: "300" }}>
                    No files found. Please add some.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilesList;
