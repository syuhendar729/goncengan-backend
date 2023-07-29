# APLIKASI GONCENGAN (BACK-END)

-   Jalankan di server local

```bash
git clone <project-ini>
npm install
npm run dev
```

-   Buka `http://localhost:3000`

-   Akses API dengan postman ke routing di bawah.

-   Akses routing berikut dengan menggunakan `Authorization` sebagai Headers dan `token` login sebagai value untuk melakukan request API:

```bash
GET     | http://localhost:3000/api/user                (get all user)
GET     | http://localhost:3000/api/user/detail         (get user self)
GET     | http://localhost:3000/api/user/detail/:id     (get user by id)
POST    | http://localhost:3000/api/user/create         (create user or registration)
PUT     | http://localhost:3000/api/user/update         (update user whitout password)
POST    | http://localhost:3000/api/order/driver        (order driver)
```

-   Model Data di Firestore `id == uid`

```json
"YMYJ0g8D7JegxPHW6ZkCrmeevL53": {
    "uid": "YMYJ0g8D7JegxPHW6ZkCrmeevL53",
    "nim": "122140000",
    "role": "None",
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

-   Model Data di Firebase Authentication

```json
{
    "email": "akun@mail.com",
    "password": "12345678",
    "displayName": "Nama di Firestore"
}
```

-   Model Data inputan untuk `create` user (untuk dicoba di postman)

```json
{
    "uid": "YMYJ0g8D7JegxPHW6ZkCrmeevL53",
    "nim": "122140000",
    "role": "None",
    "isVerified": false,
    "name": "Akun Satu",
    "avatar": "kancil",
    "urlToStudentCard": "ktm.jpg",
    "email": "akun1@mail.com",
    "password": "12345678",
    "address": {
        "formattedAddress": "Null",
        "latitude": -7.597,
        "longitude": 112.103
}
```

-   Model Data inputan untuk `update` user tanpa `password` (untuk dicoba di postman)

```json
{
    "uid": "YMYJ0g8D7JegxPHW6ZkCrmeevL53",
    "nim": "122140000",
    "role": "None",
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
} ```

- Input data booking (mileage = jarak ke lokasi dalam meter)

```json
{
    "mileage": 500
}
```
Contoh respon yang dihasilkan adalah `price` dan array `drivers` terdekat (distance = jarak dari driver ke pengemudi)
```json
{
    "price": 2000,
    "drivers": [
        {
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

