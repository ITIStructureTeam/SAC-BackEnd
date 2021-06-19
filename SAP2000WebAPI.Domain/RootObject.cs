using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //Root Object
    public class RootObject
    {
        public string ProjectName { get; set; }
        public List<Material> Materials { get; set; }
        public List<Section> Sections { get; set; }
        public List<LoadPattern> Patterns { get; set; }
        public List<LoadCombinations> Combinations { get; set; }
        public List<Point> Points { get; set; }
        public List<Frame> Frames { get; set; }
        public List<double[]> GridData { get; set; }   
    }
}
