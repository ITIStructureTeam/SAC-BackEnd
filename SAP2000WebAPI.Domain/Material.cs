using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //Material
    public class Material
    {
        public string Name { get; set; }
        public double Weight { get; set; }
        public double ElasticModulus { get; set; }
        public double Poisson { get; set; }
        public double ThermalExpansion { get; set; }
        public int MaterialType { get; set; }
        public double[] Strength { get; set; }
    }
}
