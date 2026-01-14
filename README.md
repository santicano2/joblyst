# Joblyst

## TODO:

- Mejorar landing

## 🚀 Email Notifications & Cron Jobs

### Setup Final:

1. **Crear atributo `userEmail` en Appwrite**
2. **Agregar `CRON_SECRET` a Vercel Environment Variables**
3. **En Vercel Dashboard → Settings → Crons:**
   - `/api/cron/check-interviews` → `0 9 * * *`
   - `/api/cron/check-no-response` → `0 8 * * 1`
   - `/api/cron/weekly-summary` → `0 17 * * 5`
4. **Git push** para deployar rutas

### Flujo:

- Cada postulación debe tener `userEmail`
- Crons se ejecutan automáticamente en Vercel
- Emails enviados via Resend
