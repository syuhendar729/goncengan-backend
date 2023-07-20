# APLIKASI GONCENGAN (BACK-END)

Jalankan di server local

```bash
git clone <project-ini>
npm install
npm run dev
```

Buka `http://localhost:3000`

Akses API dengan postman ke routing di bawah.

Ambil token baru yang digenerate (ulangi setiap setengah jam):

```bash
GET http://localhost:3000/api/token
```

Akses routing berikut dengan menggunakan `apikey` sebagai Headers dan `token` sebagai value untuk melakukan request API:

```bash
GET http://localhost:3000/users
GET http://localhost:3000/users/:id
POST http://localhost:3000/users
PUT http://localhost:3000/users/:id
DELETE http://localhost:3000/users/:id
```

Model data firestore:

```json
{
    "nim": "122140000",
    "nama": "Syuhada Rantisi",
    "email": "syuhendar@mail.com",
    "paySync": false,
    "verified": true,
    "alamat": {
        "alamatStr": "Gg.Andalas No.30, RT.03, RW.02",
        "geoLocation": "Null"
    },
    "file": {
        "ktm": "Path to ktm",
        "pp": "Path to pp"
    }
}
```

Masukkan `json` diatas untuk melakukan `POST` dan `PUT`
