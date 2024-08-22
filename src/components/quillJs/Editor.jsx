import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const { readOnly } = props;

  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
    getTextContent: () => {
      if (!editorRef.current) return "";
      return editorRef.current.root.innerHTML
        .replace(/<\/?[^>]+(>|$)/g, " ")
        .trim();
    },
  }));

  useEffect(() => {
    if (editorRef.current) {
      return;
    }
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      readOnly,
      modules: {
        toolbar: [
          [{ font: [] }, { size: [] }],
          [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
          ["bold", "italic", "underline", "strike"],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });
  }, [readOnly]);

  return <div id="editor" className="flex justify-center items-center" />;
});

export default Editor;
