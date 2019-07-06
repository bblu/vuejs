<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      items:[{"id":"440000197810062718","title":"Lmkjh qpxd eflqaivf twowowy kxx bulsfjwvh xnjfsm jjrqusmvce jndhp ndw etefp ziztt jjoyfnotz emccdhst bcgrmly gfvzckuo.","status":"draft","author":"name","display_time":"1979-05-11 23:59:54","pageviews":2812},{"id":"610000199405297266","title":"Jcpn gvhukj tqbf tqj wbjcuyttex zqrarjmelt mkod ntx xobhpbri bckb dbcfdzttm oviunrfro.","status":"draft","author":"name","display_time":"2011-01-24 14:55:27","pageviews":1895},{"id":"640000201611199910","title":"Oyvh ctgrirdrd rgpk sqazepb wcms kxukavrou gqlnqkhy yrcmhj scxhwzv kmpbdwyl xphnsqmy ouo.","status":"deleted","author":"name","display_time":"1996-12-01 18:25:33","pageviews":3472},{"id":"610000198812295562","title":"Mmofihjk fparlkcoj nccsp minldzfby bdeij wswhx vrj iwjdwucil svnjprd baoicz yvprdgfuow upovlhls hqwkeeh rwiswvuup cwmpwm beurfnsb jxzwwu nwrtnvbucu.","status":"draft","author":"name","display_time":"2000-11-21 16:21:09","pageviews":1573},{"id":"220000200208139464","title":"Tnlaw hdocomqyl ycrow nawvwoh dcjewwz ylcsrktxbc onncrqiyg tmkplwlt domdeazre tdtypyip tssjs shhibiqsf yajpsfda hnsnmhvibt jwgntlap eeqfvdwb.","status":"deleted","author":"name","display_time":"2003-08-24 22:45:21","pageviews":1000},{"id":"640000197405058237","title":"Oyrii perxzaj whcmud esvndxmj xbngigue rmose sbskwpjbe zkbexqx iplk udrdnqufg wjmqwhwuk obgsbouy kmjd.","status":"draft","author":"name","display_time":"1979-02-02 03:55:06","pageviews":3860},{"id":"140000200005097604","title":"Ngr jdfpmybo hdyrmmem yjlqkbtkc dlrpj uvptgjqt hoekjyfxi uvmsihus jmbutcj wpzqszrejo oqf gxosoyabq tglvod.","status":"draft","author":"name","display_time":"1985-11-08 19:46:57","pageviews":3570},{"id":"990000199008116439","title":"Veedqy zvhgpb rqebcxqdfn wzxz smyejxst grss jlqmebqhki pvmfp tltf fcnhvmvf jdppllnx crwwwa mpbiyn.","status":"published","author":"name","display_time":"2000-12-24 10:17:51","pageviews":1103},{"id":"130000200609110417","title":"Kexnleikk qofbhp owsvowdq dessjn twwrhvoko xerxseyubs soneinl ivlxzmplr fpymbq dptijn titweo apkdwsx cpvdzynmm brpqcb fop nmqf cdyn iccm.","status":"draft","author":"name","display_time":"2014-11-04 02:36:34","pageviews":3729},{"id":"810000198510016975","title":"Gnersqhjeb neqdief scplacvb snhdiglc hkwpmwua wgqqpfeg rdcwwog qaixpu bbonwwtc ymmi bhsosvnsm lvygpkfvs jihwymbxb ymnajx yjuchel dogwuqaoh pdffu.","status":"deleted","author":"name","display_time":"1979-09-06 11:47:57","pageviews":4278},{"id":"370000198709304539","title":"Xnfmosbte izyl doxease qdrmksfdf ttd lnnme pnfkohqbh fmhjtecvu znmlywyj jxpfxyg.","status":"deleted","author":"name","display_time":"2000-08-07 14:17:40","pageviews":2275},{"id":"370000199709202529","title":"Ctfxs qycykvqyo cxee jrlvgjn dtyx ekkrlful drcereukf pjyg ibnntfcxq thlyv tqm yvjtscfp rcckqjbtg fgeoxdbxv rddkzn wxjbahqp.","status":"draft","author":"name","display_time":"2017-05-02 06:04:56","pageviews":4274},{"id":"420000197010276431","title":"Zewgouh hyjmx klylqyd pckp gumwgv lbej uryhsffl yvqanwyym jmfij xsxmwn vniym.","status":"draft","author":"name","display_time":"2012-04-13 08:06:03","pageviews":2949},{"id":"460000201010069463","title":"Ccype txpz hkuwz dlhjwti vfhfwcj nugtgnovq mjxtvgco nfnwg dqmavnfbu krryrcgwpq xcor jpd dbxbon.","status":"draft","author":"name","display_time":"1980-03-13 16:18:56","pageviews":1899},{"id":"640000200805297952","title":"Seahwe koyjcw vdrmzf ybokf ghzy kferim hgh xmgbyoqe ojcqel mtslx lstfnjr.","status":"deleted","author":"name","display_time":"1994-06-26 04:43:05","pageviews":2795},{"id":"650000200006285957","title":"Bwcremij znxjy nhwk kowxzphku pakb nseydb cghxx oba wwgmbv dqbeooitzk oqjkeq rmabj uydq mebmf kyghxkwi folqejhtk zbgvf.","status":"draft","author":"name","display_time":"1976-01-07 07:49:28","pageviews":512},{"id":"710000198010154227","title":"Gautxngwpo hfsuiv hojefwgapi kbjtpoder ijt xvmtfzv ggfdrfpdkm yjsw nynhli dxzcohwkqi ncvwis kbg kueyqdozfy vzvaskgoo mvyevlr uipxvd iweeoxfyqo lqfcnkhv.","status":"published","author":"name","display_time":"2011-12-17 20:17:06","pageviews":2319},{"id":"210000201801163185","title":"Vhspptzwq csnwifbj zdfxlqtcs npslssoy yojwtcwi iyyvs bcjw frfbxj gihnue ukutbxorc tgti bjr cghzfyq licuuokmr dfkpgnlo tsznxh.","status":"draft","author":"name","display_time":"1986-12-10 07:51:02","pageviews":1397},{"id":"640000197203011465","title":"Hisoqd gfjeq ikitiryc ynwnavdjv dvjkknlng oqslrfbvjl toje weitycnigi fdrnv ubx fhhgjgmi jxcoolekx aaog.","status":"draft","author":"name","display_time":"1976-11-30 22:39:18","pageviews":4435},{"id":"450000198703293322","title":"Tfe zyvgc gpqxjhi iifl mpcylrm tzeidzrum tduzcta xyczvuc xlwrphs sytx uvjmbdo elkarjky wcdg yhc vxni evweerm njxsdqweyg omoex bygvo.","status":"published","author":"name","display_time":"2017-08-01 16:20:21","pageviews":2941},{"id":"150000201204265443","title":"Odbbj npfrogtg kylf mobq uttq euehwrys pdjbup lhpuurnmi vumftb xhcciore ondmhlkb ogonp snfmky tusajkafb jqq ivapuei rdlddr ehyo tyfejhd wnuobfmiq.","status":"draft","author":"name","display_time":"2018-09-24 08:22:32","pageviews":3396},{"id":"420000199903227847","title":"Tkwy ktcgdojn mjlnwuas yqtdzfi fteblnpgk dnfpjvumrt xfdklugy rbydpuwkah hkumocrrwn nmte.","status":"deleted","author":"name","display_time":"1981-07-03 19:37:32","pageviews":4593},{"id":"410000200007194067","title":"Uvpymca gjjeytvrc onvpyk lyvlimnvpd lwyawo cnuudqwu xfu coc sfxuyvpehr sbxsdnoddy klrkucswl jgkbepsk kslge miubykpcnb qbwnjs okxmlyr bzrxxily lvqftjfo.","status":"draft","author":"name","display_time":"1998-11-05 05:08:24","pageviews":2655},{"id":"460000200905161274","title":"Cviyypje fchsf vwrptrqkx efhn nvngdtzujw gfmwxtuxx asomukv wbkdwqoxq ovxguvbve msjq iwveo qrssb.","status":"draft","author":"name","display_time":"2011-02-05 15:44:39","pageviews":568},{"id":"500000201401216734","title":"Feiexusqi uljk zjqb cqxl wwlmms nto upruywhpc jzkefxvi ebfwzp ibqlfx rlcssyup sctrthrxe yuioc lpmy rbcse uwcqpkeo ynozx fxbfuq.","status":"draft","author":"name","display_time":"2012-09-28 22:01:15","pageviews":4415},{"id":"540000198706305933","title":"Uqbuxxqbt pwcit bfgsfcc lkd vtsv fpmbz jvvx qemki tckdya hazm plxvwbuiq xinpt aoyukb.","status":"deleted","author":"name","display_time":"1995-03-23 20:05:59","pageviews":3833},{"id":"510000198503068645","title":"Fkfeb rxfunm qydedfg fmhosi mtsvn jbbthcf srdrguyw mdix hjaqu ergdk sqybjyjbd tgtnezugw lslhdiiv iwlifs fvvs.","status":"deleted","author":"name","display_time":"1989-07-16 23:15:05","pageviews":2181},{"id":"82000020131025801X","title":"Bbsqug iuqv hdesepugm qsoun ltvoy hsid vkllwesfef gmlfie dtducp ikeeshyimb acvkdlyk jeswrb touj yxxddhahw mdhtqcjylk iwwerlpawg ibnxfqslhm.","status":"draft","author":"name","display_time":"1981-08-24 16:48:18","pageviews":2767},{"id":"32000019810410616X","title":"Lmxygj gmopqovsvr rfmtmh qlmnkivg jhhvnxurl shoydmdwgi qjew bbvrrwicx onihsseww gwsspg xjarlsvfm mxphjy ztmu gpgruzwy kbrell hluhvb vekvgtsbz.","status":"published","author":"name","display_time":"1975-02-26 21:34:37","pageviews":3059},{"id":"130000197510133585","title":"Cuc kldcjv vek dygox mkafsk gfuhihw izeyjtpp npxovpu dhcwwuvp mirdnomdk fxynwlrna bwh qwfn ccvx oyrwrf eciwrdoz yysjjiqn khegyehbpq ytsnzwxgy.","status":"draft","author":"name","display_time":"2001-02-28 11:04:30","pageviews":1510}]

    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = this.items
      //getList(this.listQuery).then(response => {
        //this.list = response.data.items
        this.listLoading = false
      //})
    }
  }
}
</script>
