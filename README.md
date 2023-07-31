# APLIKASI GONCENGAN (BACK-END)
-----
### A. Instalasi
Install `nodejs` dan dependensi lainnya seperti biasa
```bash
git clone <project-ini>
cd <project-ini>
npm install
npm run dev
```
-----
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

```bash
GET  | http://localhost:3000/api/user                (get all user)
GET  | http://localhost:3000/api/user/detail         (get user self)
GET  | http://localhost:3000/api/user/detail/:id     (get user by id)
POST | http://localhost:3000/api/user/create         (create user or registration)
PUT  | http://localhost:3000/api/user/update         (update user whitout password)
POST | http://localhost:3000/api/order/driver        (order driver)
POST | http://localhost:3000/api/order/pickdriver    (choose fix driver)
```
-----
### C. Model Data, Request, dan Respon

1. Model Data di Firestore:
   
| Parameter     | Type   | Description                     |
|---------------|--------|---------------------------------|
| `id`          | string | `id == uid` dengan uid dibuat oleh Firebase Auth              |
| `role`        | string | `driver`, `user` dan, `none`    |

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

| Parameter     | Type   | Description                     |
|---------------|--------|---------------------------------|
| `displayName` | string | Nama yang nanti ditampilkan     |

```json
{
    "email": "akun@mail.com",
    "password": "<contoh 12345678>",
    "displayName": "Nama di Firestore"
}
```

3. Format `req.body` untuk `create` user (coba di postman)

| Parameter     | Type   | Description                     |
|---------------|--------|---------------------------------|
| `uid`          | string | default berdasarkan `id`              |
| `role`        | string | `driver`, `passenger`, dan `none`    |

```json
{
    "uid": "YMYJ0g8D7JegxPHW6ZkCrmeevL53",
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

| Parameter     | Type   | Description                     |
|---------------|--------|---------------------------------|
| `role`        | string | default awal `none`    |

```json
{
    "uid": "YMYJ0g8D7JegxPHW6ZkCrmeevL53",
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

| Parameter     | Type   | Description                     |
|---------------|--------|---------------------------------|
| `mileage`     | int | Jarak dalam meter               |

```json
{
    "mileage": 1000
}
```

6. Respon adalah `price` dan array `drivers` terdekat (Radius 2Km)
7. `distance` adalah jarak dari passenger ke driver tersebut

Note: 
- `price` dihasilkan dari `Jarak per 500 m * 2000`

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
        },    
    ]
}
```

8. Format `req.body` untuk `order/pickdriver` jika pengguna telah menentukan pilihan driver seperti berikur:

```json
{
    "idDriver": "idDriverYangDipilih",
    "mileage": 1000
}
```
9. Respon dari `pickdriver`:

```json
{
    "price": 6000,
    "passenger": {
        "name": "Akun Satu",
        "avatar": "kancil",
        "address": {
            "formattedAddress": "Null",
            "latitude": -7.597,
            "longitude": 112.103
        }
    },
    "driver": {
        "name": "test4",
        "avatar": "kancil",
        "address": {
            "formattedAddress": "C433+4HF Kutorejo, Nganjuk Regency, East Java, Indonesia",
            "latitude": -7.597191,
            "longitude": 112.1039184
        }
    }
}
```
