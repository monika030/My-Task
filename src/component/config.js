export const config = {
  "features": {
    "editable": true,
    "deletable": true,
    "addUser": true
  },
  "validation": {
    "name": {
      "minLength": 3,
      "maxLength": 50,
      "required": true
    },
    "email": {
      "required": true,
      "pattern": "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"
    },
    "linkedin": {
      "required": false,
      "maxLength": 200
    },
    
    "pincode": {
      "required": true,
      "pattern": "^[0-9]{6}$"
    }
  },
  "ui": {
    "tableRowsPerPage": 10,
    "theme": "light"
  }
}