/*
   seens the mapping of skill -> tamingMob looks like from server,
   so im use hard code mapping for string mapping
   data from:
   https://github.com/Elem8100/MapleNecrocer/blob/7b4c6f06dfbb238d86464699ac33491a8b694354/MapleNecrocer/MountForm.cs#L115
*/
pub(crate) const MOUNT_SKILL_ID_MAP: [(&'static str, &'static str); 752] = [
    ("1902031", "80001642"),
    ("1902032", "80001014"),
    ("1930001", "80001533"),
    ("1932002", "80001449"),
    ("1932003", "80001024"),
    ("1932004", "80001024"),
    ("1932007", "80001004"),
    ("1932008", "80001005"),
    ("1932009", "80001006"),
    ("1932001", "80001449"),
    ("1932005", "80001483"),
    ("1932011", "80001007"),
    ("1932012", "80001074"),
    ("1932013", "80001009"),
    ("1932014", "80001010"),
    ("1932018", "80001046"),
    ("1932019", "80001004"),
    ("1932023", "80001013"),
    ("1932025", "80001014"),
    ("1932026", "80001015"),
    ("1932027", "80001016"),
    ("1932028", "80001017"),
    ("1932029", "80001030"),
    ("1932034", "80001450"),
    ("1932035", "80001019"),
    ("1932038", "80001031"),
    ("1932041", "80001020"),
    ("1932043", "80001021"),
    ("1932044", "80001022"),
    ("1932045", "80001054"),
    ("1932046", "80001044"),
    ("1932047", "80001056"),
    ("1932048", "80001023"),
    ("1932049", "80001027"),
    ("1932050", "80001028"),
    ("1932053", "80001029"),
    ("1932054", "80001030"),
    ("1932055", "80001031"),
    ("1932056", "80001032"),
    ("1932057", "80001033"),
    ("1932058", "80001084"),
    ("1932059", "80001044"),
    ("1932060", "80001413"),
    ("1932061", "80001056"),
    ("1932062", "80001030"),
    ("1932064", "80001060"),
    ("1932065", "80001082"),
    ("1932066", "80001116"),
    ("1932071", "80001061"),
    ("1932072", "80001117"),
    ("1932078", "80001118"),
    ("1932080", "80001032"),
    ("1932081", "80001062"),
    ("1932083", "80001057"),
    ("1932088", "80001029"),
    ("1932089", "80001039"),
    ("1932090", "80001044"),
    ("1932092", "80001121"),
    ("1932093", "80001082"),
    ("1932094", "80001056"),
    ("1932095", "80001175"),
    ("1932096", "80001090"),
    ("1932097", "80001112"),
    ("1932098", "80001113"),
    ("1932099", "80001114"),
    ("1932102", "80001346"),
    ("1932105", "80001124"),
    ("1932109", "80001131"),
    ("1932110", "80001137"),
    ("1932112", "80001142"),
    ("1932113", "80001144"),
    ("1932114", "80001148"),
    ("1932115", "80001149"),
    ("1932116", "80001156"),
    ("1932117", "80001157"),
    ("1932118", "80001449"),
    ("1932120", "80001173"),
    ("1932121", "80001174"),
    ("1932122", "80001175"),
    ("1932123", "80001179"),
    ("1932124", "80001180"),
    ("1932126", "80001183"),
    ("1932127", "80001184"),
    ("1932128", "80001185"),
    ("1932129", "80001186"),
    ("1932130", "80001187"),
    ("1932131", "80001183"),
    ("1932132", "80001184"),
    ("1932133", "80001185"),
    ("1932134", "80001186"),
    ("1932135", "80001187"),
    ("1932136", "80001144"),
    ("1932137", "80001148"),
    ("1932138", "80001149"),
    ("1932139", "80001196"),
    ("1932140", "80001198"),
    ("1932143", "80001220"),
    ("1932144", "80001221"),
    ("1932145", "80001198"),
    ("1932146", "80001223"),
    ("1932147", "80001221"),
    ("1932148", "80001228"),
    ("1932149", "80001228"),
    ("1932150", "80001229"),
    ("1932151", "80001230"),
    ("1932152", "80001241"),
    ("1932153", "80001237"),
    ("1932154", "80001240"),
    ("1932156", "80001243"),
    ("1932157", "80001244"),
    ("1932158", "80001245"),
    ("1932159", "80001246"),
    ("1932161", "80001257"),
    ("1932162", "80001258"),
    ("1932163", "80001260"),
    ("1932164", "80001261"),
    ("1932165", "80001277"),
    ("1932166", "80001277"),
    ("1932167", "80001285"),
    ("1932168", "80001285"),
    ("1932169", "80001285"),
    ("1932170", "80001289"),
    ("1932171", "80001290"),
    ("1932172", "80001031"),
    ("1932173", "80001292"),
    ("1932174", "80001285"),
    ("1932175", "80001289"),
    ("1932176", "80001290"),
    ("1932177", "80001067"),
    ("1932178", "80001068"),
    ("1932186", "80001060"),
    ("1932187", "80001312"),
    ("1932188", "80001313"),
    ("1932189", "80001314"),
    ("1932190", "80001315"),
    ("1932191", "80001316"),
    ("1932192", "80001317"),
    ("1932193", "80001075"),
    ("1932194", "80001118"),
    ("1932195", "80001320"),
    ("1932196", "80001032"),
    ("1932197", "80001044"),
    ("1932198", "80001327"),
    ("1932199", "80001331"),
    ("1932200", "80001336"),
    ("1932201", "80001338"),
    ("1932202", "80001343"),
    ("1932203", "80001331"),
    ("1932204", "80001345"),
    ("1932205", "80001333"),
    ("1932206", "80001346"),
    ("1932207", "80001347"),
    ("1932208", "80001142"),
    ("1932211", "80001131"),
    ("1932212", "80001355"),
    ("1932214", "80001387"),
    ("1932216", "80001398"),
    ("1932217", "80001329"),
    ("1932218", "80001411"),
    ("1932219", "80001413"),
    ("1932220", "80001419"),
    ("1932221", "80001421"),
    ("1932222", "80001260"),
    ("1932223", "80001404"),
    ("1932224", "80001435"),
    ("1932225", "80001449"),
    ("1932226", "80001450"),
    ("1932227", "80001019"),
    ("1932228", "80001453"),
    ("1932230", "80001454"),
    ("1932231", "80001068"),
    ("1932232", "80001002"),
    ("1932235", "80001484"),
    ("1932236", "80001531"),
    ("1932237", "80001440"),
    ("1932238", "80001441"),
    ("1932239", "80001442"),
    ("1932240", "80001443"),
    ("1932241", "80001444"),
    ("1932242", "80001445"),
    ("1932243", "80001447"),
    ("1932244", "80001508"),
    ("1932245", "80001023"),
    ("1932247", "80001490"),
    ("1932248", "80001491"),
    ("1932249", "80001492"),
    ("1932250", "80001074"),
    ("1932251", "80001505"),
    ("1932252", "80001517"),
    ("1932253", "80001531"),
    ("1932254", "80001549"),
    ("1932255", "80001112"),
    ("1932256", "80001552"),
    ("1932258", "80001077"),
    ("1932259", "80001557"),
    ("1932261", "80001584"),
    ("1932262", "80001492"),
    ("1932263", "80001561"),
    ("1932264", "80001562"),
    ("1932265", "80001563"),
    ("1932266", "80001564"),
    ("1932267", "80001565"),
    ("1932268", "80001566"),
    ("1932269", "80001567"),
    ("1932270", "80001568"),
    ("1932271", "80001569"),
    ("1932272", "80001570"),
    ("1932273", "80001571"),
    ("1932274", "80001572"),
    ("1932275", "80001582"),
    ("1932276", "80001584"),
    ("1932278", "80011111"),
    ("1932279", "80001586"),
    ("1932280", "80011127"),
    ("1932281", "80001776"),
    ("1932282", "80011129"),
    ("1932283", "80001019"),
    ("1932284", "80001450"),
    ("1932285", "80001449"),
    ("1932286", "80002257"),
    ("1932287", "80011135"),
    ("1932288", "80001778"),
    ("1932289", "80001766"),
    ("1932294", "80001630"),
    ("1932295", "80001631"),
    ("1932296", "80001630"),
    ("1932297", "80001592"),
    ("1932298", "80001631"),
    ("1932300", "80001630"),
    ("1932301", "80001631"),
    ("1932304", "80001701"),
    ("1932305", "80001703"),
    ("1932306", "80001707"),
    ("1932307", "80001708"),
    ("1932310", "80001582"),
    ("1932311", "80001713"),
    ("1932314", "80001507"),
    ("1932319", "80001763"),
    ("1932320", "80001113"),
    ("1932321", "80001766"),
    ("1932322", "80001769"),
    ("1932323", "80001775"),
    ("1932324", "80001776"),
    ("1932325", "80001778"),
    ("1932331", "80011238"),
    ("1932332", "80001533"),
    ("1932333", "80001582"),
    ("1932334", "80001784"),
    ("1932335", "80001786"),
    ("1932336", "80001790"),
    ("1932337", "80001792"),
    ("1932338", "80001796"),
    ("1932339", "80001810"),
    ("1932341", "80001811"),
    ("1932342", "80001813"),
    ("1932343", "80001866"),
    ("1932344", "80001867"),
    ("1932345", "80001868"),
    ("1932346", "80011256"),
    ("1932347", "80001870"),
    ("1932348", "80001246"),
    ("1932349", "80001241"),
    ("1932353", "80001918"),
    ("1932354", "80001920"),
    ("1932357", "80001592"),
    ("1932358", "80001934"),
    ("1932359", "80001935"),
    ("1932360", "80001921"),
    ("1932361", "80001923"),
    ("1932362", "80001931"),
    ("1932363", "80001932"),
    ("1932365", "80001942"),
    ("1932367", "80001796"),
    ("1932368", "80001950"),
    ("1932369", "80001951"),
    ("1932370", "80001952"),
    ("1932371", "80001950"),
    ("1932372", "80001951"),
    ("1932373", "80001952"),
    ("1932374", "80001956"),
    ("1932375", "80001958"),
    ("1932377", "80001975"),
    ("1932378", "80001977"),
    ("1932379", "80001980"),
    ("1932380", "80001982"),
    ("1932381", "80001986"),
    ("1932382", "80001986"),
    ("1932383", "80001988"),
    ("1932384", "80001989"),
    ("1932385", "80001990"),
    ("1932386", "80001991"),
    ("1932387", "80001991"),
    ("1932388", "80001993"),
    ("1932389", "80002221"),
    ("1932390", "80011359"),
    ("1932391", "80001997"),
    ("1932392", "80001995"),
    ("1932393", "80002200"),
    ("1932394", "80002201"),
    ("1932395", "80002202"),
    ("1932396", "80011395"),
    ("1932397", "80011397"),
    ("1932398", "80002219"),
    ("1932399", "80002204"),
    ("1932400", "80002205"),
    ("1932401", "80002220"),
    ("1932402", "80002221"),
    ("1932403", "80002222"),
    ("1932404", "80011359"),
    ("1932404", "80011405"),
    ("1932405", "80002223"),
    ("1932406", "80002225"),
    ("1932407", "80002202"),
    ("1932408", "80002204"),
    ("1932409", "80002229"),
    ("1932410", "80002233"),
    ("1932411", "80002234"),
    ("1932412", "80002235"),
    ("1932413", "80011421"),
    ("1932414", "80002236"),
    ("1932415", "80002238"),
    ("1932416", "80011424"),
    ("1932416", "80001769"),
    ("1932418", "80002240"),
    ("1932419", "80002242"),
    ("1932420", "80002244"),
    ("1932421", "80002248"),
    ("1932422", "80002250"),
    ("1932423", "80002252"),
    ("1932424", "80002252"),
    ("1932425", "80011431"),
    ("1932426", "80002270"),
    ("1932427", "80002259"),
    ("1932428", "80002258"),
    ("1932429", "80002257"),
    ("1932430", "80002260"),
    ("1932431", "80002262"),
    ("1932432", "80002265"),
    ("1932433", "80011438"),
    ("1932434", "80002266"),
    ("1932435", "80011443"),
    ("1932436", "80011445"),
    ("1932437", "80011447"),
    ("1932438", "80002272"),
    ("1932439", "80002271"),
    ("1932440", "80011436"),
    ("1932441", "80002276"),
    ("1932442", "80002278"),
    ("1932443", "80011451"),
    ("1932444", "80011453"),
    ("1932445", "80002287"),
    ("1932446", "80002289"),
    ("1932447", "80002315"),
    ("1932448", "80002294"),
    ("1932449", "80002296"),
    ("1932450", "80002299"),
    ("1932451", "80002203"),
    ("1932452", "80002302"),
    ("1932453", "80002304"),
    ("1932454", "80002305"),
    ("1932455", "80002307"),
    ("1932456", "80011486"),
    ("1932457", "80011488"),
    ("1932458", "80002309"),
    ("1932459", "80002313"),
    ("1932460", "80001813"),
    ("1932461", "80002240"),
    ("1932462", "80002317"),
    ("1932463", "80002318"),
    ("1932464", "80002319"),
    ("1932465", "80002321"),
    ("1932466", "80011500"),
    ("1932467", "80011502"),
    ("1932468", "80002335"),
    ("1932469", "80011506"),
    ("1932470", "80002345"),
    ("1932471", "80002347"),
    ("1932472", "80002349"),
    ("1932473", "80002349"),
    ("1932474", "80002356"),
    ("1932475", "80002358"),
    ("1932476", "80002351"),
    ("1932477", "80002352"),
    ("1932478", "80002351"),
    ("1932479", "80002361"),
    ("1932480", "80002352"),
    ("1932481", "80011531"),
    ("1932482", "80011533"),
    ("1932483", "80002367"),
    ("1932484", "80011524"),
    ("1932485", "80011535"),
    ("1932486", "80002369"),
    ("1932488", "80002372"),
    ("1932489", "80002373"),
    ("1932490", "80002374"),
    ("1932491", "80002375"),
    ("1932492", "80002372"),
    ("1932493", "80002373"),
    ("1932494", "80002374"),
    ("1932495", "80001005"),
    ("1932496", "80011541"),
    ("1932497", "80002392"),
    ("1932498", "80002400"),
    ("1932499", "80002402"),
    ("1932500", "80002417"),
    ("1932501", "80002418"),
    ("1932502", "80011551"),
    ("1932503", "80011554"),
    ("1932504", "80002425"),
    ("1932505", "80002425"),
    ("1932506", "80002427"),
    ("1932507", "80002429"),
    ("1932508", "80002431"),
    ("1932509", "80011571"),
    ("1932510", "80002433"),
    ("1932511", "80002429"),
    ("1932511", "80002435"),
    ("1932512", "80011580"),
    ("1932513", "80002437"),
    ("1932514", "80002439"),
    ("1932515", "80002443"),
    ("1932516", "80002441"),
    ("1932517", "80002446"),
    ("1932518", "80002447"),
    ("1932519", "80011639"),
    ("1932520", "80011642"),
    ("1932521", "80002448"),
    ("1932522", "80002450"),
    ("1932523", "80011646"),
    ("1932524", "80002454"),
    ("1932525", "80002424"),
    ("1932526", "80001988"),
    ("1932527", "80002546"),
    ("1932528", "80002547"),
    ("1932529", "80011698"),
    ("1932530", "80011554"),
    ("1932535", "80002569"),
    ("1932536", "80002569"),
    ("1932537", "80002571"),
    ("1932538", "80002573"),
    ("1932539", "80011554"),
    ("1932540", "80002622"),
    ("1932541", "80011712"),
    ("1932542", "80002585"),
    ("1932543", "80002628"),
    ("1932544", "80002630"),
    ("1932545", "80011706"),
    ("1932546", "80002625"),
    ("1932547", "80011721"),
    ("1932548", "80002625"),
    ("1932549", "80002625"),
    ("1932550", "80002648"),
    ("1932551", "80002650"),
    ("1932552", "80002594"),
    ("1932553", "80002595"),
    ("1932554", "80011733"),
    ("1932555", "80011737"),
    ("1932556", "80002654"),
    ("1932557", "80002655"),
    ("1932558", "80002714"),
    ("1932559", "80011743"),
    ("1932560", "80002659"),
    ("1932561", "80002661"),
    ("1932562", "80002663"),
    ("1932563", "80002665"),
    ("1932564", "80002667"),
    ("1932565", "80011758"),
    ("1932566", "80011760"),
    ("1932567", "80002668"),
    ("1932569", "80002668"),
    ("1932570", "80011784"),
    ("1932571", "80002698"),
    ("1932572", "80002418"),
    ("1932572", "80002699"),
    ("1932573", "80002702"),
    ("1932574", "80011773"),
    ("1932575", "80011775"),
    ("1932576", "80011777"),
    ("1932577", "80011779"),
    ("1932578", "80011798"),
    ("1932579", "80011791"),
    ("1932580", "80002712"),
    ("1932581", "80002713"),
    ("1932582", "80011806"),
    ("1932583", "80011808"),
    ("1932584", "80002715"),
    ("1932585", "80002717"),
    ("1932586", "80002717"),
    ("1932587", "80011819"),
    ("1932588", "80011820"),
    ("1932589", "80002735"),
    ("1932590", "80002202"),
    ("1932590", "80002738"),
    ("1932591", "80002736"),
    ("1932592", "80011821"),
    ("1932594", "80002740"),
    ("1932595", "80002747"),
    ("1932596", "80002752"),
    ("1932597", "80002754"),
    ("1932598", "80002756"),
    ("1932599", "80011825"),
    ("1932600", "80011844"),
    ("1932601", "80002742"),
    ("1932602", "80002743"),
    ("1932603", "80002742"),
    ("1932603", "80002744"),
    ("1932610", "80011850"),
    ("1932612", "80002824"),
    ("1932613", "80011856"),
    ("1932614", "80002843"),
    ("1932615", "80002831"),
    ("1932616", "80002845"),
    ("1932617", "80002846"),
    ("1932618", "80002853"),
    ("1932619", "80002854"),
    ("1932622", "80011913"),
    ("1932623", "80002858"),
    ("1932624", "80002862"),
    ("1932625", "80002859"),
    ("1932626", "80011923"),
    ("1932627", "80011928"),
    ("1932628", "80011931"),
    ("1932629", "80011932"),
    ("1932630", "80011934"),
    ("1932631", "80011936"),
    ("1932632", "80002869"),
    ("1932633", "80002870"),
    ("1932634", "80011927"),
    ("1932635", "80002872"),
    ("1932637", "80002873"),
    ("1932638", "80002873"),
    ("1932639", "80002983"),
    ("1932640", "80011944"),
    ("1932641", "80002881"),
    ("1932642", "80002884"),
    ("1932643", "80001320"),
    ("1932644", "80002754"),
    ("1932645", "80011960"),
    ("1932646", "80011962"),
    ("1932648", "80002922"),
    ("1932649", "80011983"),
    ("1932650", "80002937"),
    ("1932651", "80002938"),
    ("1932652", "80011923"),
    ("1932653", "80011985"),
    ("1932654", "80011985"),
    ("1932655", "80011985"),
    ("1932656", "80001957"),
    ("1932657", "80011988"),
    ("1932658", "80011989"),
    ("1932661", "80011923"),
    ("1932663", "80002944"),
    ("1932664", "80011923"),
    ("1932665", "80012034"),
    ("1932666", "80012034"),
    ("1932667", "80012034"),
    ("1932668", "80012034"),
    ("1932669", "80012054"),
    ("1932670", "80002979"),
    ("1932671", "80001320"),
    ("1932672", "80001320"),
    ("1932673", "80002984"),
    ("1932674", "80002985"),
    ("1932675", "80002986"),
    ("1932676", "80002669"),
    ("1932678", "80002989"),
    ("1932679", "80002989"),
    ("1932680", "80012062"),
    ("1932681", "80002994"),
    ("1932682", "80002990"),
    ("1932684", "80012067"),
    ("1932685", "80012072"),
    ("1932687", "80002991"),
    ("1932688", "80002996"),
    ("1932689", "80002993"),
    ("1932690", "80012079"),
    ("1932691", "80002754"),
    ("1932692", "80002997"),
    ("1932693", "80002997"),
    ("1932694", "80001293"),
    ("1932696", "80012090"),
    ("1932697", "80012096"),
    ("1932698", "80003029"),
    ("1932699", "80012103"),
    ("1932700", "80011923"),
    ("1932701", "80011923"),
    ("1932704", "80003050"),
    ("1932705", "80003057"),
    ("1932706", "80012149"),
    ("1932707", "80011923"),
    ("1932708", "80003065"),
    ("1932709", "80003066"),
    ("1932710", "80003067"),
    ("1932713", "80002989"),
    ("1932715", "80012224"),
    ("1932716", "80012227"),
    ("1932717", "80012228"),
    ("1932718", "80012229"),
    ("1932719", "80012249"),
    ("1932720", "80003115"),
    ("1932721", "80003116"),
    ("1932723", "80012256"),
    ("1932724", "80003117"),
    ("1932725", "80003121"),
    ("1932726", "80003122"),
    ("1932727", "80003118"),
    ("1932728", "80003119"),
    ("1932729", "80003120"),
    ("1932735", "80012267"),
    ("1932736", "80012268"),
    ("1932737", "80012269"),
    ("1932738", "80012269"),
    ("1932739", "80012271"),
    ("1932740", "80003123"),
    ("1932749", "80012291"),
    ("1932750", "80012294"),
    ("1932753", "80003135"),
    ("1932754", "80012295"),
    ("1932755", "80003139"),
    ("1932756", "80003140"),
    ("1932757", "80012300"),
    ("1932758", "80012301"),
    ("1932759", "80011923"),
    ("1932760", "80003145"),
    ("1932761", "80011923"),
    ("1932762", "80011923"),
    ("1932764", "80003150"),
    ("1932765", "80003185"),
    ("1932766", "80012478"),
    ("1932767", "80012358"),
    ("1932768", "80012361"),
    ("1932769", "80003202"),
    ("1932770", "80012362"),
    ("1932771", "80003212"),
    ("1932772", "80003098"),
    ("1932773", "80003173"),
    ("1932774", "80003174"),
    ("1932775", "80003175"),
    ("1932776", "80012354"),
    ("1932777", "80012364"),
    ("1932778", "80012384"),
    ("1932779", "80012384"),
    ("1932780", "80012389"),
    ("1932781", "80003214"),
    ("1932782", "80003216"),
    ("1932783", "80012391"),
    ("1932784", "80011960"),
    ("1932785", "80011960"),
    ("1932786", "80012396"),
    ("1932787", "80003186"),
    ("1932788", "80003187"),
    ("1932789", "80011960"),
    ("1932790", "80003218"),
    ("1932791", "80003218"),
    ("1932792", "80011960"),
    ("1932793", "80003225"),
    ("1932794", "80012402"),
    ("1932795", "80012402"),
    ("1932796", "80012403"),
    ("1932797", "80012404"),
    ("1932798", "80011960"),
    ("1932799", "80011960"),
    ("1932800", "80003230"),
    ("1932801", "80003231"),
    ("1932802", "80003232"),
    ("1932804", "80003244"),
    ("1932805", "80003245"),
    ("1932806", "80003231"),
    ("1932807", "80003247"),
    ("1932808", "80011960"),
    ("1932809", "80011960"),
    ("1932810", "80011960"),
    ("1932811", "80003249"),
    ("1932812", "80003250"),
    ("1932813", "80003251"),
    ("1932814", "80003256"),
    ("1932816", "80003257"),
    ("1932817", "80011960"),
    ("1932818", "80011960"),
    ("1932819", "80003262"),
    ("1932820", "80003264"),
    ("1932821", "80011960"),
    ("1932822", "80012425"),
    ("1932824", "80003270"),
    ("1932825", "80011960"),
    ("1932826", "80003187"),
    ("1932827", "80003298"),
    ("1932828", "80012434"),
    ("1932829", "80003310"),
    ("1932830", "80011960"),
    ("1932831", "80003314"),
    ("1932832", "80011960"),
    ("1932833", "80012445"),
    ("1932834", "80011960"),
    ("1932836", "80003338"),
    ("1932837", "80011960"),
    ("1932838", "80012449"),
    ("1932839", "80011960"),
    ("1932840", "80001814"),
    ("1932841", "80003249"),
    ("1932842", "80011960"),
    ("1932843", "80011960"),
    ("1932844", "80011960"),
    ("1932845", "80003392"),
    ("1932846", "80012475"),
    ("1932848", "80011960"),
    ("1932852", "80011960"),
    ("1932859", "80011960"),
    ("1932865", "80011960"),
    ("1932866", "80012487"),
    ("1932868", "80012488"),
    ("1932872", "80012490"),
    ("1939000", "80001617"),
    ("1939001", "80001619"),
    ("1939002", "80001621"),
    ("1939003", "80001623"),
    ("1939004", "80001625"),
    ("1939005", "80001627"),
    ("1939006", "80001629"),
    ("1939011", "80011732"),
    ("1939016", "80002855"),
    ("1939017", "80001320"),
    ("1939018", "80002920"),
    ("1939019", "80002981"),
    ("1939020", "80003030"),
    ("1942382", "80011533"),
    ("1942385", "80011535"),
    ("1942387", "80011546"),
    ("1992002", "80001016"),
    ("1992003", "80001066"),
    ("1992004", "80001067"),
    ("1992005", "80001068"),
    ("1992006", "80001069"),
    ("1992007", "80001007"),
    ("1992008", "80001029"),
    ("1992010", "80001008"),
    ("1992011", "80001074"),
    ("1992012", "80001075"),
    ("1992013", "80001031"),
    ("1992014", "80001077"),
    ("1992015", "80001120"),
    ("1992026", "80001246"),
    ("1992027", "80001261"),
    ("1992028", "80001296"),
    ("1992029", "80001329"),
    ("1992030", "80001330"),
    ("1992031", "80001403"),
    ("1992032", "80001258"),
    ("1992035", "80001257"),
    ("1992036", "80001237"),
    ("1992043", "80001492"),
    ("1992050", "80001246"),
];
