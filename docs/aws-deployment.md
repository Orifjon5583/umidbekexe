# CodePractice AWS Joylashtirish (Production Deployment) Yo‘riqnomasi

Ushbu hujjat CodePractice tizimini Amazon Web Services (AWS) bulutli infratuzilmasiga joylashtirish bo‘yicha to‘liq qadamma-qadam yo‘riqnomani taqdim etadi.

---

## 1. AWS Arxitekturasi Rejasi

- **Frontend (Web-panel)**: Amazon S3 (Static Website) + Amazon CloudFront (CDN + SSL)
- **Backend API**: Amazon ECS Fargate (Docker konteynerlarida xavfsiz va serverless boshqaruv)
- **Ma’lumotlar Bazasi**: Amazon RDS PostgreSQL (Multi-AZ, Private Subnet)
- **Maxfiy Kalitlar**: AWS Secrets Manager (JWT sirlari, DB parollari, Gemini AI API kaliti)
- **Domen va Sertifikat**: Amazon Route 53 + AWS Certificate Manager (ACM)
- **Monitoring va Loglar**: Amazon CloudWatch Logs + Alarms

---

## 2. Qadamma-qadam Joylashtirish

### 1-qadam: ECR (Elastic Container Registry) ga Backendni Yuklash

```bash
# 1. ECR repozitoriysiga login qilish
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# 2. API konteynerini build qilish
docker build -t codepractice-api -f apps/api/Dockerfile .

# 3. Teglash va ECR ga yuklash
docker tag codepractice-api:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codepractice-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codepractice-api:latest
```

### 2-qadam: RDS PostgreSQL Yaratish (Private Subnet)
1. AWS Console -> RDS -> Create Database.
2. Dvigatel: **PostgreSQL 16**.
3. Andoza: **Production** (yoki Dev/Test uchun `db.t4g.micro` / `db.t4g.small`).
4. Tarmoq: VPC ichidagi **Private Subnet** tanlanadi. **Publicly Accessible: No** qilib belgilanadi.
5. Security Group: Faqat ECS Fargate Security Group’idan kiruvchi `5432` portiga ruxsat beriladi.

### 3-qadam: Sirlarni Saqlash (Secrets Manager)
AWS Secrets Manager orqali quyidagi sirlar yaratiladi:
- `codepractice/database_url`: `postgresql://admin:password@rds-endpoint:5432/codepractice?schema=public`
- `codepractice/jwt_access_secret`: Xavfsiz 32+ belgili kalit
- `codepractice/jwt_refresh_secret`: Xavfsiz 32+ belgili kalit
- `codepractice/ai_api_key`: Google Gemini API kaliti

### 4-qadam: ECS Fargate Xizmatini Ishga Tushirish
1. `infrastructure/aws/ecs-task-definition.json` faylini ro‘yxatdan o‘tkazing:
   ```bash
   aws ecs register-task-definition --cli-input-json file://infrastructure/aws/ecs-task-definition.json
   ```
2. Application Load Balancer (ALB) yarating va 443 (HTTPS) portini ECS tasklariga yo‘naltiring.
3. ECS Service yaratib, minimal 2 ta task bilan Fargate rejimida ishga tushiring.

### 5-qadam: Web-panelni S3 va CloudFront ga Joylashtirish
```bash
# 1. Web loyihani ishlab chiqarish uchun yig'ish (build)
npm run build --workspace=@codepractice/web

# 2. S3 paqiriga sinxronizatsiya qilish
aws s3 sync apps/web/dist s3://codepractice-teacher-panel --delete

# 3. CloudFront keshini tozalash (Invalidation)
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

---

## 3. Zaxira Nusxalar (Backups) va Qayta Tiklash

1. **RDS Automated Backups**: 7 kunlik avtomatik tiklash (Point-In-Time Restore) yoqiladi.
2. **Snapshotlar**: Har haftalik manual snapshot olinadi va boshqa mintaqaga (cross-region) nusxalanadi.

---

## 4. 20 nafar O‘quvchi Uchun Yuklama Sinovi

Production muhitida server 20 nafar o‘quvchi parallel ishlashini ta’minlashini tekshirish uchun:
```bash
API_BASE_URL=https://api.sizningdomeningiz.uz/api/v1 npx ts-node apps/api/test/load-test.ts
```
