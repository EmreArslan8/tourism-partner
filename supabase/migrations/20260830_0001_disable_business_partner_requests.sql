-- Ücretli üyelik özelliği yayına alınana kadar işletmeler yeni partnerlik talebi
-- gönderemez. Uygulama akışı korunur; açılışta bu politika aktif üyelik şartıyla
-- yeniden tanımlanmalıdır. Mevcut talepleri okuma/yanıtlama/iptal etme korunur.
drop policy if exists "Business owners can create outgoing partner requests"
  on public.business_partner_requests;

notify pgrst, 'reload schema';
