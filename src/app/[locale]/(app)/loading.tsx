export default function AppLoading() {
  return (
    <main className="min-h-screen bg-sapphire-deep">
      <div className="container-px py-10" aria-busy="true" aria-label="Sayfa yükleniyor">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/15" />
        <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded-[10px] bg-white/12" />
        <div className="mt-8 h-[320px] animate-pulse rounded-[16px] border border-white/10 bg-white/8" />
      </div>
    </main>
  );
}
