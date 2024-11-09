import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProduct = () => {
  const [enteredInput, setEnteredInput] = useState({
    name: '',
    category: '',
    price: '',
    count: '',
    shortDescription: '',
    longDescription: '',
  });
  const [inputEdit, setInputEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://asm-njs03-server.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data =>
        setEnteredInput({
          name: data.name,
          category: data.category,
          price: data.price,
          count: data.count,
          shortDescription: data.short_desc,
          longDescription: data.long_desc,
        })
      );
  }, [id]);

  // Handle text input changes
  const handleChangeInput = e => {
    setEnteredInput(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  let isValidForm = false;

  const emptyKeys = Object.keys(enteredInput).find(
    key => enteredInput[key] === ''
  );

  if (!emptyKeys) {
    isValidForm = true;
  }
  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setInputEdit(true);

    if (!isValidForm) {
      return;
    }
    const formData = new FormData();

    // Append text inputs to formData
    formData.append('name', enteredInput.name);
    formData.append('category', enteredInput.category);
    formData.append('price', enteredInput.price);
    formData.append('count', enteredInput.count);
    formData.append('shortDescription', enteredInput.shortDescription);
    formData.append('longDescription', enteredInput.longDescription);

    try {
      // Send the form data to the server
      const response = await axios.put(
        // `https://asm-njs03-server.onrender.com/api/products/edit-product/${id}`,
        `http://localhost:5000/api/products/edit-product/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Files uploaded successfully:', response.data);
      if (response.status === 200) {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'block' }}>
      <div className="page-breadcrumb">
        <div className="row">
          <form
            onSubmit={handleSubmit}
            style={{ width: '50%', marginLeft: '40px' }}
          >
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Product Name"
                id="name"
                value={enteredInput.name}
                onChange={handleChangeInput}
              />
              {inputEdit && enteredInput['name'] === '' && (
                <span style={{ color: 'red' }}>name must not be empty!</span>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category"
                id="category"
                value={enteredInput.category}
                onChange={handleChangeInput}
              />
              {inputEdit && enteredInput['category'] === '' && (
                <span style={{ color: 'red' }}>
                  category must not be empty!
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                className="form-control"
                placeholder="Price"
                id="price"
                value={enteredInput.price}
                onChange={handleChangeInput}
              />
              {inputEdit && enteredInput['price'] === '' && (
                <span style={{ color: 'red' }}>price must not be empty!</span>
              )}
            </div>
            <div className="form-group">
              <label>Count</label>
              <input
                type="text"
                className="form-control"
                placeholder="Count"
                id="count"
                value={enteredInput.count}
                onChange={handleChangeInput}
              />
              {inputEdit && enteredInput['count'] === '' && (
                <span style={{ color: 'red' }}>count must not be empty!</span>
              )}
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter Short Description"
                id="shortDescription"
                value={enteredInput.shortDescription}
                onChange={handleChangeInput}
              ></textarea>
              {inputEdit && enteredInput['shortDescription'] === '' && (
                <span style={{ color: 'red' }}>
                  short description must not be empty!
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Long Description</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Enter Long Description"
                id="longDescription"
                value={enteredInput.longDescription}
                onChange={handleChangeInput}
              ></textarea>
              {inputEdit && enteredInput['longDescription'] === '' && (
                <span style={{ color: 'red' }}>
                  long description must not be empty!
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
