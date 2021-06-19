using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //DeformationPoints
    public class DeformationPoints
    {   
        public string FrameID { get; set; }
        public List<Point> AssociatedPoints { get; set; }

        public DeformationPoints()
        {
            AssociatedPoints = new List<Point>();
        }
    }
}
