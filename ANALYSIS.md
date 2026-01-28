# MTN Enerji Ön Muhasebe / Stok Takip – Profesyonel Analiz ve Tasarım Taslağı

## 1) Mevcut Durum (Repo Tespiti)
Bu repoda çalıştırılabilir bir uygulama veya kaynak kod bulunmuyor. Yalnızca **boş bir yer tutucu dosya** (`2026muhasebe`) ve **logo görseli** (`mtnlogo.png`) mevcut. Bu nedenle teknik analiz, mimari inceleme veya güvenlik değerlendirmesi yapılamıyor.

## 2) Hedef: Kurumsal Düzey Ön Muhasebe + Stok Takip
Amaç; şirketinizin günlük operasyonlarını **hızlandıran**, **hataları azaltan** ve **raporlama gücü yüksek** bir sistem tasarlamak. Aşağıdaki taslak gerçek bir ürün yol haritasıdır.

### 2.1 Çekirdek Modüller
**A) Ön Muhasebe**
- Cari Hesaplar (Müşteri/Tedarikçi)
- Tahsilat/Ödeme
- Fatura/İrsaliye
- Banka & Kasa
- Mutabakat

**B) Stok & Depo**
- Stok kartları (kod, barkod, birim, grup)
- Depolar arası transfer
- Sayım ve fark raporları
- Minimum/azami stok uyarıları

**C) Satın Alma & Satış**
- Teklif → Sipariş → İrsaliye → Fatura akışı
- Kâr marjı ve maliyet analizi
- Satış temsilcisi performansı

**D) Raporlama**
- Günlük/aylık nakit akışı
- Cari yaşlandırma
- Stok devir hızı
- En çok/az satılan ürünler

**E) Yönetim Konsolu**
- Kullanıcı/rol yönetimi
- Yetki matrisi (modül ve işlem bazlı)
- Log/audit ve veri dışa aktarma

### 2.2 Kullanıcı Rolleri
- Yönetici (tüm yetkiler)
- Muhasebe
- Depo
- Satış
- Satın Alma
- Yönetim/Raporlama (salt okunur)

### 2.3 Kritik İş Akışları (Örnek)
- **Satış**: Teklif → Sipariş → İrsaliye → Fatura → Tahsilat
- **Satın Alma**: Talep → Sipariş → Mal Kabul → Fatura → Ödeme
- **Stok**: Mal giriş/çıkış → Sayım → Fark raporu

### 2.4 İş Kuralları (Örnek)
- Faturası kesilmeyen irsaliye raporları
- Eksi stok engeli veya uyarısı
- Vadeli tahsilat/ödeme takvimi
- Fiyat listesi ve kampanya tarihi kontrolü

## 3) Veri Modeli (Özet)
- **CariHesap** (müşteri/tedarikçi)
- **StokKart**
- **Depo**
- **Fatura, Irsaliye, Siparis**
- **Kasa, BankaHareket**
- **StokHareket**
- **Kullanici, Rol, Yetki**

## 4) Mimari Yaklaşım (Kurumsal Standart)
- **Katmanlı mimari**: API (iş kuralları) + UI (web) + DB
- **Domain kuralları**: stok hareketi, cari bakiye, KDV/iskonto hesapları
- **Entegrasyon**: e-Fatura/e-Arşiv, banka hareketleri, Excel içe aktarma
- **Güvenlik**: JWT, 2FA opsiyonu, log/audit, RBAC

## 5) UX/UI İlkeleri (CEO Perspektifi)
- 3 tıklamada kritik işlemler (fatura kes, tahsilat gir, stok giriş)
- Net dashboard: güncel kasa/banka, kritik stok uyarıları, vadesi gelen alacaklar
- Hızlı arama, barkod tarama ve kısayol menüsü

## 6) Teknoloji Önerisi (Kurumsal Ölçek)
- **Backend**: .NET / Java / Node.js (REST + JWT)
- **Frontend**: React / Vue
- **DB**: PostgreSQL veya MS SQL
- **Raporlama**: Metabase / PowerBI entegrasyonu
- **Hosting**: On-prem veya bulut (AWS/Azure)

## 7) Fonksiyonel Gereksinimler (Özet)
- **Fatura & İrsaliye**: seri numara, KDV/iskonto, kalem bazında maliyet
- **Cari Yönetimi**: limit, risk takibi, mutabakat
- **Stok**: lot/seri no opsiyonu, maliyet yöntemleri (FIFO/Ortalama)
- **Tahsilat/Ödeme**: vadeli plan, kısmi tahsilat
- **Raporlama**: filtrelenebilir, dışa aktarılabilir

## 8) Non-Functional Gereksinimler
- **Performans**: yoğun günlerde 1 saniye altında listeleme hedefi
- **Güvenlik**: RBAC, audit log, kritik işlemler için onay akışı
- **Süreklilik**: otomatik yedekleme ve geri dönüş planı
- **İzlenebilirlik**: kullanıcı bazlı işlem geçmişi

## 9) MVP (90 Günlük İlk Sürüm)
1. Cari hesap, stok kart, fatura ve kasa modülleri
2. Stok giriş/çıkış ve depo transferi
3. Temel raporlar (nakit akışı, cari yaşlandırma)
4. Rol bazlı yetkilendirme
5. Excel içe/dışa aktarma

## 10) Yol Haritası (12 Ay)
- **0-3 Ay (MVP)**: çekirdek modüller + temel raporlar
- **3-6 Ay**: gelişmiş raporlama, e-Fatura/e-Arşiv entegrasyonu
- **6-9 Ay**: mobil depo uygulaması, barkod otomasyonu
- **9-12 Ay**: BI raporları, tahminleme, otomatik uyarılar

## 11) Başarı Kriterleri (KPI)
- Fatura kesme süresi ≤ 2 dakika
- Stok sayım farkı %1’in altında
- Cari kapanış ve mutabakat süresi %40 kısalma

## 12) Veri Taşıma ve Geçiş Planı (Özet)
- Mevcut Excel/CSV verileri için alan eşleştirme
- Test import → doğrulama → üretime aktarım
- 2 haftalık paralel çalışma ve kontrol

## 13) Riskler ve Önlemler
- **Yanlış veri**: import kontrol raporları ve örneklem doğrulama
- **Kullanıcı alışkanlıkları**: eğitim ve kısa video kılavuzlar
- **Entegrasyon gecikmesi**: aşamalı devreye alma

## 14) İhtiyaç Listesi (Başlamak İçin)
Lütfen aşağıdaki bilgileri paylaşırsanız tam analiz ve detaylı tasarım dokümanı çıkarabilirim:
- Mevcut veri (Excel/CSV) örnekleri
- Kullanıcı sayısı ve rol dağılımı
- Örnek fatura/irsaliye formatı
- Mevcut iş akışları ve onay süreçleri

---
**Not:** Kaynak kod veya zip içeriği sağlandığında, mevcut yazılımın detaylı teknik analizi (mimari, güvenlik, performans, iyileştirme alanları) yapılacaktır.
