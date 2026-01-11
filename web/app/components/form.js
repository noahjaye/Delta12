import { useState } from "react";

function Form(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop page reload
    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {props.name}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
