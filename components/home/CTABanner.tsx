import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTABanner() {
  return (
    <div className="px-4 py-6">
      <div className="bg-sky-light rounded-card p-5 text-center">
        <h2 className="text-lg font-bold text-ink mb-2">
          own a local business?
        </h2>
        <p className="text-sm text-grey mb-4">
          Add your shop to whitstable.shop and reach more locals and visitors
        </p>
        <Link href="/auth/signup?role=shop_owner">
          <Button variant="primary" size="md">
            add your shop
          </Button>
        </Link>
      </div>
    </div>
  );
}
