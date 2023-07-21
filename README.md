# APLIKASI GONCENGAN (BACK-END)

- Jalankan di server local

```bash
git clone <project-ini>
npm install
npm run dev
```

- Buka `http://localhost:3000`

- Akses API dengan postman ke routing di bawah.

- Akses routing berikut dengan menggunakan `Authorization` sebagai Headers dan `token` login sebagai value untuk melakukan request API:

```bash
GET http://localhost:3000/api/user          (get all user)
GET http://localhost:3000/api/user/:id      (get user by id)
POST http://localhost:3000/api/user/create  (create user or registration)
PUT http://localhost:3000/api/user/update   (update user)
DELETE (Fitur dinonaktifkan)
```

-  Model Data di Firestore `id == uid`

```json
"PoDrDYwKQ1hrcsdv8aQ1TNitcKZ2": {
    "uid": "PoDrDYwKQ1hrcsdv8aQ1TNitcKZ2",
    "nim": "122140000",
    "paySync": false,
    "email": "syuhendar@mail.com",
    "urlToStudentCard": "ktm.jpg",
    "urlToAvatar": "profile.jpg",
    "geolocation": {
        "_latitude": 0,
        "_longitude": 0
    },
    "formattedLocation": "Way Huwi, Bandar Lampung",
    "fcmToken": "Null",
    "isVerified": false,
    "name": "Syuhada Rantisi"
}
```

- Model Data di Firebase Authentication

```json
{ "email": "akun@mail.com", "password": "12345678", "displayName": "Nama di Firestore" }
```

- Model Data inputan untuk `create` user (untuk dicoba di postman)

```json
{
    "nim": "122140000",
    "paySync": false,
    "email": "syuhendar@mail.com",
    "password": "12345678",
    "urlToStudentCard": "ktm.jpg",
    "urlToAvatar": "profile.jpg",
    "geolocation": {
        "_latitude": 0,
        "_longitude": 0
    },
    "formattedLocation": "Way Huwi, Bandar Lampung",
    "fcmToken": "Null",
    "isVerified": false,
    "name": "Syuhada Rantisi"
}
```


- Model Data inputan untuk `update` user tanpa `password` (untuk dicoba di postman)

```json
{
    "nim": "122140000",
    "paySync": false,
    "email": "syuhendar@mail.com",
    "urlToStudentCard": "ktm.jpg",
    "urlToAvatar": "profile.jpg",
    "geolocation": {
        "_latitude": 0,
        "_longitude": 0
    },
    "formattedLocation": "Way Huwi, Bandar Lampung",
    "fcmToken": "Null",
    "isVerified": false,
    "name": "Syuhada Rantisi"
}
```
