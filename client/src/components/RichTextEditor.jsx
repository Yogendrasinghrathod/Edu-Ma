import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";

const RichTextEditor = ({ input, setInput }) => {
  const onChangeHandler = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <ReactQuill
      theme="snow"
      className="dark:bg-black  "
      value={input?.description || ""}
      onChange={onChangeHandler}
    />
  );
};

RichTextEditor.propTypes = {
  input: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
  setInput: PropTypes.func.isRequired,
};

export default RichTextEditor;
