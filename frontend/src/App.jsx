import { useEffect, useState } from "react";

import { getDeliveries, getPackages, getPhotographers } from "./api/client";
import { AppShell } from "./layout/AppShell";
import { DeliveryWorkspace } from "./features/delivery/DeliveryWorkspace";
import { PackageShowcase } from "./features/packages/PackageShowcase";
import { ScheduleBooking } from "./features/photographers/ScheduleBooking";

export default function App() {
  const [packages, setPackages] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPackages(), getPhotographers(), getDeliveries()])
      .then(([packageData, photographerData, deliveryData]) => {
        setPackages(packageData);
        setPhotographers(photographerData);
        setDeliveries(deliveryData);
      })
      .catch(() => setError("服务暂时不可用，请确认后端已启动。"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      {error && <div className="notice notice-error">{error}</div>}
      <PackageShowcase packages={packages} loading={loading} />
      <ScheduleBooking packages={packages} photographers={photographers} />
      <DeliveryWorkspace deliveries={deliveries} onDeliveriesChange={setDeliveries} />
    </AppShell>
  );
}
