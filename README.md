## Requirements:

```bash
   - nodejs

   - mongodb
```

## Getting Started

1. First, run the development server:

   ```bash
   - npm init

   - npm start
   ```

## Demo api

## **Login**

- **URL**

  ```bash
      {host} / v1/api/shop/login
  ```

- **Method:** **POST**

- **req.body**

```bash
   {
    "email": "voicon06@gmail.com",
    "password": "11243442sdsds"
   }
```

- **header**

```bash
   x-api-key :35a6d01fca3e13d3cf1023a0aa8df1736e8b32ff0017f83743d12ec3a08c85abb71a02cc93b152e1ab59d8731be7d8ec2be3de22a7fcddb7bb1c245fcec4313e
```

- **Success Response:**

```bash
    {
    "message": "OK",
    "status": 200,
    "metadata": {
         "shop": {
              "_id": "660d26e6c35e899f099d53e5",
              "name": "hai3",
              "email": "voicon06@gmail.com"
         },
         "tokens": {
              "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjBkMjZlNmMzNWU4OTlmMDk5ZDUzZTUiLCJlbWFpbCI6InZvaWNvbjA2QGdtYWlsLmNvbSIsImlhdCI6MTcxMjg1NTc4NSwiZXhwIjoxNzEzMDI4NTg1fQ.O7fO_GXFmq92oPgYYLMJIBJI_B_7TCez63HM9hteoOw",
              "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjBkMjZlNmMzNWU4OTlmMDk5ZDUzZTUiLCJlbWFpbCI6InZvaWNvbjA2QGdtYWlsLmNvbSIsImlhdCI6MTcxMjg1NTc4NSwiZXhwIjoxNzEzNDYwNTg1fQ.RCwVRYuTv1UBAUQ3Ep-f7I_JRIRPHv4BpQFAzS1INII"
         }
       }
    }
```

- **Error Response:**

```bash
  {
    "status": "error",
    "code": 400,
    "message": "Shop not registed"
     }`
```
