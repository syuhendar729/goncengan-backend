# APLIKASI GONCENGAN (BACK-END)

---

### A. Instalasi

Install `nodejs` dan dependensi lainnya seperti biasa

```bash
git clone <project-ini>
cd <project-ini>
npm install
npm run dev
```

---

### B. Penggunaan

1. Buka `http://localhost:3000`
2. Buka Postman atau tools API Testing lainnya
3. Lakukan login di terminal seperti ini untuk mendapatkan token (bisa dilakukan lewat front-end atau postman)

```bash
curl --location --request POST 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY_FIREBASE]
' \
--header 'content-type: application/json' \
--data-raw '{
    "email": "[EMAIL]",
    "password": "[PASSWORD]",
    "returnSecureToken": true
}'
```

5. Gunakan **Header** `Authorization: Bearer {token}` untuk melakukan request API
6. Akses routing di bawah ini sesuai kebutuhan

- User API:

| Method | URL                                      | Description               |
|--------|------------------------------------------|---------------------------|
| GET    | `http://localhost:3000/api/user`           | Get all user              |
| GET    | `http://localhost:3000/api/user/detail`    | Get user self             |
| GET    | `http://localhost:3000/api/user/detail/:id`| Get user by id            |
| POST   | `http://localhost:3000/api/user/create`    | Create user or registration |
| PUT    | `http://localhost:3000/api/user/update`    | Update user without password |

- Order API:
  
| Method | URL                                      | Description               |
|--------|------------------------------------------|---------------------------|
| POST   | `http://localhost:3000/api/order/driver`   | Order driver              |
| POST   | `http://localhost:3000/api/order/pickdriver` | Choose fixed driver      |

- Transaction API:
  
| Method | URL                                            | Description                     |
|--------|------------------------------------------------|---------------------------------|
| POST   | `http://localhost:3000/api/pay/create-transaction` | Create new transaction          |
| GET    | `http://localhost:3000/api/pay/finish-transaction` | URL redirect finish transaction |
| POST   | `http://localhost:3000/api/pay/notification-transaction` | Callback notification midtrans |
| GET    | `http://localhost:3000/api/pay/check-transaction/:orderId` | Get status transaction by orderId |
| GET    | `http://localhost:3000/api/pay/error-transaction` | URL redirect error transaction  |

- Wallet API:
  
| Method | URL                                      | Description               |
|--------|------------------------------------------|---------------------------|
| GET    | `http://localhost:3000/api/wallet/get-balance` | Get balance               |
| GET    | `http://localhost:3000/api/wallet/get-income` | Get income                |
| GET    | `http://localhost:3000/api/wallet/get-expense` | Get expense               |
| GET    | `http://localhost:3000/api/wallet/get-alldata` | Get all data              |
| POST   | `http://localhost:3000/api/wallet/payout-request` | Payout request            |


---

### C. Model Data, Request, dan Respon

1. Model Data di Firestore:

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `id`      | string | `id == uid` dengan uid dibuat oleh Firebase Auth |
| `role`    | string | `driver`, `user` dan, `none`                     |

```json
"idDefaultDibuat": {
    "uid": "uidDefaultDibuat",
    "nim": "122140000",
    "role": "none",
    "isVerified": false,
    "name": "Akun Satu",
    "avatar": "kancil",
    "urlToStudentCard": "ktm.jpg",
    "email": "akun1@mail.com",
    "address": {
        "formattedAddress": "Null",
        "latitude": -7.597,
        "longitude": 112.103
    }
}
```

2. Model Data di Firebase Authentication:

| Parameter     | Type   | Description                 |
| ------------- | ------ | --------------------------- |
| `displayName` | string | Nama yang nanti ditampilkan |

```json
{
    "email": "akun@mail.com",
    "password": "<contoh 12345678>",
    "displayName": "Nama di Firestore"
}
```

3. Format `req.body` untuk `create` user (coba di postman)

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| `role`    | string | `driver`, `passenger`, dan `none` |

```json
{
    "nim": "122140000",
    "role": "none",
    "isVerified": false,
    "name": "Akun Satu",
    "avatar": "kancil",
    "urlToStudentCard": "ktm.jpg",
    "email": "akun1@mail.com",
    "password": "<contoh 12345678>",
    "address": {
        "formattedAddress": "Null",
        "latitude": -7.597,
        "longitude": 112.103
}
```

4. Format `req.body` untuk `update` user tanpa `password` (coba di postman)

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| `role`    | string | default awal `none` |

```json
{
    "nim": "122140000",
    "role": "none",
    "isVerified": false,
    "name": "Akun Satu",
    "avatar": "kancil",
    "urlToStudentCard": "ktm.jpg",
    "email": "akun1@mail.com",
    "address": {
        "formattedAddress": "Null",
        "latitude": -7.597,
        "longitude": 112.103
    }
}
```

5. Format `req.body` untuk `order/driver` sebagai berikut:

| Parameter | Type | Description       |
| --------- | ---- | ----------------- |
| `mileage` | int  | Jarak dalam meter |

```json
{
    "mileage": 1000
}
```

6. Respon adalah `price` dan array `drivers` terdekat (Radius 2Km)
7. `distance` adalah jarak dari passenger ke driver tersebut

Note:

-   `price` dihasilkan dari `Jarak per 500 m * 2000`

```json
{
    "price": 4000,
    "drivers": [
        {
            "id": "idDriverTerdekat",
            "name": "Nama Driver",
            "avatar": "kancil",
            "address": {
                "formattedAddress": "C433+4HF Kutorejo, Nganjuk Regency, East Java, Indonesia",
                "latitude": -7.597191,
                "longitude": 112.1039184
            },
            "distance": 103.54494171950418
        }
    ]
}
```

8. Format `req.body` untuk `order/pickdriver` jika pengguna telah menentukan pilihan driver seperti berikur:

```json
{
    "idDriver": "idDriverYangDipilih",
    "mileage": 1000,
    "departureLocation": {
        "formattedAddress": "null",
        "latitude": 0,
        "longitude": 0
    },
    "destinationLocation": {
        "formattedAddress": "null",
        "latitude": 0,
        "longitude": 0
    }
}
```

9. Respon dari `pickdriver`:

```json
{
    "price": 4000,
    "passenger": {
        "name": "Akun Satu",
        "avatar": "kancil",
        "fcmToken": null
    },
    "driver": {
        "name": "test4",
        "avatar": "kancil",
        "fcmToken": null
    }
}
```

10. Payment
    -   Create transaction:
    -   Callback transaction:
    -   Notification transaction:

```bash
{
  transaction_type: 'on-us',
  transaction_time: '2023-08-07 09:13:30',
  transaction_status: 'settlement',
  transaction_id: 'f4cd5c82-0f42-4f10-9920-cea5264d36c9',
  status_message: 'midtrans payment notification',
  status_code: '200',
  signature_key: 'f6dd78805de670806b3d1415fdc0c10b976ea8fc7764fdc99f390f77ad1a5fd075307277089b60a6ba1a60cee4bc47363efeaa17993df969868e9de57ae9c4fa',
  settlement_time: '2023-08-07 09:13:49',
  reference_id: 'fac1099e-99f9-475c-96f0-235a54d5d2f3',
  payment_type: 'qris',
  order_id: 'testing_id_00003',
  merchant_id: 'G789012978',
  issuer: 'gopay',
  gross_amount: '3000.00',
  fraud_status: 'accept',
  expiry_time: '2023-08-07 09:28:30',
  currency: 'IDR',
  acquirer: 'gopay'
}
```

