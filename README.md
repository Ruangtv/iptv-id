# iptv-id

## Langsung Running

Jalankan server iptv playlist generator di local komputer dengan perintah:

```
npx iptv-id start
```

Lalu buka playlist dengan IPTV Player seperti [VLC Player](https://www.videolan.org/vlc/).

**URL Playlist**

```url
http://localhost:3000/playlist.m3u
```

## Custom Channel

Untuk kustom channel kamu bisa lakukan dengan cara:

1. Clone

```sh
git clone https://github.com/mwafa/iptv-id.git
cd iptv-id
```

2. Edit channel di file `db.csv`
3. Install dependencies

```sh
npm install
```

4. Jalankan Server

```sh
npm start
```

---

Repositori ini terinspirasi dari https://github.com/mwafa/iptv
