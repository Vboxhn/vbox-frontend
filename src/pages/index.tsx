// src/pages/index.tsx
export default function Home() { return null; }
export async function getServerSideProps() {
  return { redirect: { destination: '/client/login', permanent: false } };
}
