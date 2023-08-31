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
2. Buat file `.env` untuk beberapa variable berikut:

```bash
# Firebase
PROJECT_ID=""
PRIVATE_KEY_ID=""
PRIVATE_KEY=""
CLIENT_EMAIL=""
CLIENT_ID=""
CLIENT_CERT_URL=""
FCM_SERVER_KEY=""
# Midtrans
MIDTRANS_CLIENT_KEY=""
MIDTRANS_SERVER_KEY=""
MIDTRANS_FINISH_URL=""
MIDTRANS_ERROR_URL=""
```

3. Buka Postman atau tools API Testing lainnya
4. Lakukan login di terminal seperti ini untuk mendapatkan token (bisa dilakukan lewat front-end atau postman)

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

-   User API:

| Method | URL                                         | Description                  |
| ------ | ------------------------------------------- | ---------------------------- |
| GET    | `http://localhost:3000/api/user/detail`     | Get user self                |
| POST   | `http://localhost:3000/api/user/create`     | Create user or registration  |
| PUT    | `http://localhost:3000/api/user/update`     | Update user without password |

-   Booking API:

| Method | URL                                          | Description         |
| ------ | -------------------------------------------- | ------------------- |
| POST   | `http://localhost:3000/api/order/driver-bookingroom`             | Driver Create Room   |
| DELETE | `http://localhost:3000/api/order/driver-cancelroom/:bookingId`   | Driver Cancel Room |
| PATCH  | `http://localhost:3000/api/order/driver-cancelroom/`             | Driver Cancel Passenger from Room |
| PATCH  | `http://localhost:3000/api/order/passenger-bookingroom`          | Passenger Join in Room |
| GET    | `http://localhost:3000/api/order/passenger-getroom`              | Passenger Get Matching Room |
| PATCH  | `http://localhost:3000/api/order/passenger-cancelroom/`          | Passenger Cancel Room |
| GET    | `http://localhost:3000/api/order/liveroom`                       | Get Liveroom from Current Location |

-   Payment API:

| Method | URL                                                        | Description                       |
| ------ | ---------------------------------------------------------- | --------------------------------- |
| POST   | `http://localhost:3000/api/pay/create-transaction`         | Driver create new transaction            |
| GET    | `http://localhost:3000/api/pay/get-detail-transaction`     | Get detail transaction    |

-   Wallet API:

| Method | URL                                               | Description    |
| ------ | ------------------------------------------------- | -------------- |
| GET    | `http://localhost:3000/api/wallet/get-income`     | Get income     |
| GET    | `http://localhost:3000/api/wallet/get-expense`    | Get expense    |
| GET    | `http://localhost:3000/api/wallet/get-alldata`    | Get all data   |
| POST   | `http://localhost:3000/api/wallet/payout-request` | Payout request |
| PATCH   | `http://localhost:3000/api/wallet/update-wallet` | Edit Rekening Wallet |

---

### C. Model Data, Request, dan Respon

- Check Link Postman
