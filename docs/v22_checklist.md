# v22 Check-list (P0/P1/P2 + DoD)

## P0
- [ ] DDL (enum/tablo/index/view) uygulandı  
  **DoD:** `db/ddl_v22.sql` başarıyla çalıştı; mevcut veriler korunuyor.
- [ ] Transaction wrapper devrede  
  **DoD:** `withTransaction` ile tüm fiş akışları atomik.
- [ ] İptal/Ters motoru aktif  
  **DoD:** CANCELLED/REVERSED durumları raporlardan hariç.
- [ ] Hareketlerden türetilen rapor view’ları  
  **DoD:** `stok_ozet`, `cari_bakiye_ozet`, `kasa_gunluk_ozet` doğru topluyor.

## P1
- [ ] UI “Sil” kaldırıldı; “İptal/Ters” eklendi  
  **DoD:** Butonlar role göre disable + tooltip.
- [ ] Roller ve izin matrisi tanımlı  
  **DoD:** ADMIN tam yetki; USER iptal/ters yok.
- [ ] Yedekleme betikleri kuruldu (günlük + manuel)  
  **DoD:** Dump + SHA256 loglandı; test restore ok.

## P2
- [ ] Testler (Gherkin + Jest iskelet)  
  **DoD:** Çekirdek senaryolar koşturulabilir.
- [ ] Performans indeksleri gözden geçirildi  
  **DoD:** Fiş/kalem aramaları hızlı (<200ms lokal).
- [ ] Rollback planı belgeledi  
  **DoD:** v21 dump ile dönüş provası başarılı.

## Canlıya Alma
- [ ] Tam yedek + checksum
- [ ] `db/migration_v21_to_v22.sql` uygulandı
- [ ] Rapor sonuçları örnek veriyle doğrulandı
- [ ] Kullanıcı eğitimi (iptal/ters fiş) verildi

## Geri Dönüş Planı
- v21 dump’ı yükle (`scripts/restore.ps1`)
- v22 UI “iptal/ters” geçici kapatılabilir
- Eski raporlama path’i korunur
