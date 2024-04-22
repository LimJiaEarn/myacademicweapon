
import Pie from '@/components/shared/Piechart';

const Page = () => {

    const x = 20;
    const data = [x, 100-x];
    const colors = ['#43A19E', '#7B43A1'];
    const radius = 150;
    const hole = 100;
    const strokeWidth = 4;

    
    return (
      <div className="flex_center gap-4">


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
