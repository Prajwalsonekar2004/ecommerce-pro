type Props = {
  slug: string;
};

export default function ProductInfo({ slug }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm-uppercase tracking-[0.25em] text-neutral-500">
        BlackHead
      </p>

      <h1 className="text-4xl font-bold">{slug}</h1>

      <p className="text-3xl font-semibold">₹1,499</p>

      <p className="text-neutral-600">
        Premium oversized cotton t-shirt crafted for everyday comfort.
      </p>
    </div>
  );
}
