using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class LoadCombinationsDetails
    {
        public string Name { get; set; }
        public LoadCombinationsInfo[] Info { get; set; }
    }
}
