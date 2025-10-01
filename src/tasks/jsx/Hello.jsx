/* Простой компонент на JSX без типизации */
export default function Hello() {
  const name = "JSX";
  return (
    <div>
      <div>Привет, {name}!</div>
      <small>Это компонент на чистом JSX.</small>
    </div>
  );
}
