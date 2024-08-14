import React, { useState, useEffect } from 'react'
import { CSVLink } from 'react-csv'
import * as XLSX from 'xlsx'
import './FormComponent.css'

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    phno: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    amount: '',
    dateTime: new Date().toLocaleString(),
  })

  const [submittedData, setSubmittedData] = useState([])
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    const storedData = localStorage.getItem('submittedData')
    if (storedData) {
      setSubmittedData(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('submittedData', JSON.stringify(submittedData))
  }, [submittedData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editIndex !== null) {
      const updatedData = submittedData.map((data, index) =>
        index === editIndex ? formData : data
      )
      setSubmittedData(updatedData)
      setEditIndex(null)
    } else {
      setSubmittedData([...submittedData, formData])
    }
    setFormData({
      name: '',
      phno: '',
      address: '',
      city: '',
      state: 'Tamil Nadu',
      amount: '',
      dateTime: new Date().toLocaleString(),
    })
  }

  const handleEdit = (index) => {
    setFormData(submittedData[index])
    setEditIndex(index)
  }

  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this entry?'
    )
    if (confirmDelete) {
      const updatedData = submittedData.filter((_, i) => i !== index)
      setSubmittedData(updatedData)
    }
  }

  const handlePrint = (data) => {
    const printWindow = window.open('', '_blank', 'width=400', 'height=500')
    printWindow.document.write('<html><head><title>Print</title>')
    printWindow.document.write('<style>')
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
      }
      .print-container {
        width: 80%;
        margin: 160px auto 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 8px;
        vertical-align: top;
      }
      .title {
        font-weight: bold;
        width: 40%;
      }
      .data {
        width: 60%;
      }
    `)
    printWindow.document.write('</style></head><body>')
    printWindow.document.write('<div class="print-container">')
    printWindow.document.write('<table>')
    printWindow.document.write(
      '<tr><td class="title">Name:</td><td class="data">' +
        data.name +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Phone no:</td><td class="data">' +
        data.phno +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Address:</td><td class="data">' +
        data.address +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">City:</td><td class="data">' +
        data.city +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">State:</td><td class="data">' +
        data.state +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Amount Received:</td><td class="data">' +
        data.amount +
        '</td></tr>'
    )
    printWindow.document.write(
      '<tr><td class="title">Date & Time:</td><td class="data">' +
        data.dateTime +
        '</td></tr>'
    )
    printWindow.document.write('</table>')
    printWindow.document.write('</div>')
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const mappedData = jsonData.map((row) => ({
          name: row['Name'] || '',
          phno: row['Phone number'] || '',
          address: row['Address'] || '',
          city: row['City'] || '',
          state: row['State'] || 'Tamil Nadu', // Default to Tamil Nadu if not provided
          amount: row['Amount Received'] || '',
          dateTime: row['Date & Time'] || new Date().toLocaleString(),
        }))

        setSubmittedData((prevData) => [...prevData, ...mappedData])
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Phone number', key: 'phno' },
    { label: 'Address', key: 'address' },
    { label: 'City', key: 'city' },
    { label: 'State', key: 'state' },
    { label: 'Amount Received', key: 'amount' },
    { label: 'Date & Time', key: 'dateTime' },
  ]

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone number:</label>
          <input
            type="number"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Amount Received:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date & Time:</label>
          <input
            type="text"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            disabled
          />
        </div>
        <button className="btn" type="submit">
          {editIndex !== null ? 'Update' : 'Submit'}
        </button>
      </form>

      <hr />

      <h2>Submitted Data</h2>

      <input
        className="upload-btn"
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Amount Received</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.phno}</td>
                <td>{data.address}</td>
                <td>{data.city}</td>
                <td>{data.state}</td>
                <td>{data.amount}</td>
                <td>{data.dateTime}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                  <button onClick={() => handlePrint(data)}>Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="download">
        {submittedData.length > 0 && (
          <CSVLink
            data={submittedData}
            headers={headers}
            filename={'submitted-data.csv'}
          >
            <button className="download-btn">
              Download <br /> (spreadsheet)
            </button>
          </CSVLink>
        )}
      </div>
    </div>
  )
}

export default FormComponent
