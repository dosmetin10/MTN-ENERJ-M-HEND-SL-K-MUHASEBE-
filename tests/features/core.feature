Feature: MTN ERP v22 temel akışları

  Background:
    Given temiz bir veritabanı
    And varsayılan roller ve kullanıcılar mevcut

  Scenario: Satış fişi stok düşürür ve cari borçlandırır
    When SATIS türünde 3 adet stok için fiş oluşturulur
    Then ilgili stok bakiyesi 3 azalır
    And ilgili cari bakiyesi NET kadar artar

  Scenario: Alış fişi stok artırır ve cari alacaklandırır
    When ALIS türünde 5 adet stok için fiş oluşturulur
    Then stok bakiyesi 5 artar
    And cari bakiyesi NET kadar azalır

  Scenario: Satış iade stok artırır ve cari alacaklandırır
    Given daha önce 4 adet SATIS yapılmıştır
    When SATIS_IADE ile 2 adet iade yapılır
    Then stok 2 artar
    And cari alacak NET kadar artar

  Scenario: Alış iade stok azaltır ve cari borçlandırır
    Given daha önce 6 adet ALIS yapılmıştır
    When ALIS_IADE ile 1 adet iade yapılır
    Then stok 1 azalır
    And cari borç NET kadar artar

  Scenario: Fiş iptali ACTIVE değilse reddedilir
    Given CANCELLED durumlu bir fiş
    When iptal talep edilir
    Then işlem başarısız olur

  Scenario: Fiş tersleme ACTIVE değilse reddedilir
    Given REVERSED durumlu bir fiş
    When tekrar tersleme talep edilir
    Then işlem başarısız olur

  Scenario: Aynı fiş iki kez terslenemez
    Given ACTIVE bir fiş
    When ters kayıt üretilir
    And tekrar ters kayıt istenir
    Then işlem başarısız olur

  Scenario: Kasa tahsilat cari bakiyeyi düşürür
    Given SATIS ile 1000 TL borçlanmış cari
    When 400 TL tahsilat yapılır
    Then cari bakiye 600 TL kalır
    And kasa net 400 TL artar

  Scenario: Kasa ödeme tedarikçi bakiyesini düşürür
    Given ALIS ile 800 TL alacaklı tedarikçi
    When 300 TL ödeme yapılır
    Then bakiye 500 TL kalır
    And kasa net 300 TL azalır

  Scenario: Elektrik kesintisi sırasında işlem rollback edilir
    When işlem ortasında hata oluşur
    Then hiçbir hareket kalmaz

  Scenario: Stok yetersizse SATIS reddedilir
    Given stokta 1 adet vardır
    When 5 adet SATIS yapılmak istenir
    Then işlem başarısız olur

  Scenario: Raporlar ACTIVE kayıtları toplar
    Given çeşitli ACTIVE ve CANCELLED hareketler vardır
    When stok_ozet, cari_bakiye_ozet, kasa_gunluk_ozet çekilir
    Then iptal edilenler dahil edilmez

  Scenario: İptal edilen fiş raporlarda görünmez
    Given ACTIVE fiş iptal edilmiştir
    When raporlar alınır
    Then ilgili tutarlar sıfırlanır
