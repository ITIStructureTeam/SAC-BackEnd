using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class Section
    {
        public string Name { get; set; }
        public string Material { get; set; }
        public int SecType { get; set; }
        public double[] Dimensions { get; set; }
        public double[] PropModifiers { get; set; }
    }
}
