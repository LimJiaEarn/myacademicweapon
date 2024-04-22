
import Pie from '@/components/shared/Piechart';

const data = [10, 15, 20, 25, 30];
const colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
const radius = 150;
const hole = 50;
const strokeWidth = 3;

const Page = () => {
  return (
    <div className="flex_center gap-4">
      <h1>Pie Chart Example</h1>
      <Pie
        data={data}
        colors={colors}
        radius={radius}
        hole={hole}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default Page;
