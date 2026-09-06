/* =====================================================================
   KRISTAL SAGA - RPG Teks 2D ala Undertale
   File: game.js  (v2 - level, skill tree, lantai dungeon, kritis, dinding)
   ===================================================================== */

/* ============================== SPRITE PLAYER ============================== */
const PLAYER_CELL_W = 84, PLAYER_CELL_H = 128;
const PLAYER_FRAMES = { down:[0,1], up:[2,3], side:[4,5] };
let playerSheetLoaded = false;
const playerSheet = new Image();
playerSheet.onload = ()=>{ playerSheetLoaded = true; };
playerSheet.src = "assets/player_spritesheet.png";

function drawPlayerSprite(ctx, x, y, direction, moving){
  if(!playerSheetLoaded){
    ctx.font="30px serif"; ctx.textAlign="center"; ctx.fillText("🧑", x, y);
    return;
  }
  direction = direction || "down";
  const toggle = moving && (Math.floor(Date.now()/220)%2===0);
  let frames, mirror = false;
  if(direction==="down") frames = PLAYER_FRAMES.down;
  else if(direction==="up") frames = PLAYER_FRAMES.up;
  else { frames = PLAYER_FRAMES.side; mirror = (direction==="left"); } // FIX: sprite dasar menghadap kanan, jadi mirror saat ke KIRI
  const idx = frames[toggle?1:0];
  const sx = idx*PLAYER_CELL_W;
  const drawH = 52, drawW = drawH*(PLAYER_CELL_W/PLAYER_CELL_H);
  ctx.save();
  if(mirror){ ctx.translate(x,0); ctx.scale(-1,1); ctx.translate(-x,0); }
  ctx.drawImage(playerSheet, sx, 0, PLAYER_CELL_W, PLAYER_CELL_H, x-drawW/2, y-drawH+10, drawW, drawH);
  ctx.restore();
}
function updateFacingFromKeys(keys){
  if(keys.left) player.facing="left";
  else if(keys.right) player.facing="right";
  else if(keys.up) player.facing="up";
  else if(keys.down) player.facing="down";
  return !!(keys.left||keys.right||keys.up||keys.down);
}

/* ============================== SPRITE MONSTER ============================== */
const MONSTER_SPRITES = {
  cave_troll:        { file:"Cave_Healing_Troll.png",   w:32, h:32, frames:2 },
  lime:              { file:"lime.png",                 w:32, h:32, frames:3 },
  large_snake:       { file:"large_snake.png",           w:32, h:32, frames:2 },
  mirrorfiend:       { file:"Mirrorfiend.png",           w:32, h:32, frames:2 },
  jy_titan:          { file:"Junkyard_Titan.png",        w:48, h:48, frames:3 },
  jy_skeleton:       { file:"Junkyard_skeleton.png",     w:32, h:32, frames:2 },
  jy_goblin:         { file:"Junkyard_Goblin.png",       w:32, h:32, frames:2 },
  jy_tinyboxer:      { file:"Junkyard_Tiny_Boxer.png",   w:32, h:32, frames:2 },
  jy_goliath:        { file:"Junkyard_Goliath.png",      w:48, h:48, frames:3 },
  jy_golem:          { file:"Junkyard_Golem.png",        w:32, h:32, frames:2 },
  jy_buffed_titan:   { file:"Junkyard_Buffed_Titan.png", w:48, h:48, frames:3 },
  jy_brute:          { file:"Junkyard_Brute.png",        w:32, h:32, frames:2 },
  green_blob:        { file:"Green_Blob_form_1.png",     w:32, h:32, frames:1 },
  giant_turtle:      { file:"Giant_Turtle.png",          w:32, h:32, frames:2 },
  happy_blob:        { file:"Happy_Blob.png",            w:64, h:64, frames:4 },
  jy_boxer:          { file:"Junkyard_Boxer.png",        w:32, h:32, frames:2 },
  graveyard_guardian:{ file:"Graveyard_Guardian.png",    w:32, h:32, frames:2 },
  goblin_cutthroat:  { file:"Goblin_Cutthroat.png",      w:32, h:32, frames:2 },
  giant_spider:      { file:"Giant_Spider.png",          w:64, h:64, frames:4 },
  frost_yetling:     { file:"Frost_Yetling.png",         w:32, h:32, frames:2 },
  frost_ice_buff:    { file:"Frost_Ice_Buff.png",        w:32, h:32, frames:2 },
  skeleton:          { file:"Skeleton.png",               w:32, h:32, frames:3 },
  skeleton_spearman: { file:"Skeleton_Spearman.png",      w:32, h:32, frames:3 },
  skeleton_warrior:  { file:"Skeleton_Warrior.png",       w:32, h:32, frames:3 },
  skeletal_rat:      { file:"Skeletal_Rat.png",           w:48, h:48, frames:4 },
  skeletal_rat_boss: { file:"Skeletal_Rat_Boss.png",      w:64, h:64, frames:4 },
  spectral_harvester:{ file:"Spectral_Harvester_1.png",   w:48, h:48, frames:2 },
  spectral_hound:    { file:"Spectral_Hound.png",         w:32, h:32, frames:2 },
  spectral_hound2:   { file:"Spectral_Hound_2.png",       w:32, h:32, frames:2 },
  shell_tortoise:    { file:"Shell_Tortoise.png",         w:32, h:32, frames:2 },
  stone_slug:        { file:"Stone_Slug_1.png",           w:32, h:32, frames:3 },
  spiderling_leader: { file:"Spiderling_Swarm_Leader.png",w:32, h:32, frames:4 },
  tiny_spider:       { file:"tiny_spider.png",            w:32, h:32, frames:2 },
  tick:              { file:"tick.png",                   w:32, h:32, frames:1 },
  suspicious_blob:   { file:"Suspicious_Blob.png",        w:32, h:32, frames:4 },
  toxic_pile:        { file:"Toxic_Sludge_Pile.png",      w:48, h:48, frames:3 },
  toxic_skeleton:    { file:"Toxic_Sludge_Skeleton.png",  w:48, h:48, frames:3 },
  toxic_slime:       { file:"Toxic_Sludge_Slime.png",     w:32, h:32, frames:2 },
  toxic_small_pile:  { file:"Toxic_Sludge_Small_Pile.png",w:32, h:32, frames:2 },
  toxic_wisp:        { file:"Toxic_Sludge_wisp.png",      w:32, h:32, frames:2 },
  volcano_drake_boss:{ file:"Volcano_Drake_Boss.png",     w:84, h:84, frames:4 },
  abyss_druid:       { file:"Abyss_Druid.png",             w:32, h:32, frames:2 },
  abyss_fat_gargoyle:{ file:"Abyss_Fat_Gargoyle.png",      w:32, h:32, frames:2 },
  abyss_goblin:      { file:"Abyss_Goblin.png",             w:32, h:32, frames:2 },
  abyss_imp:         { file:"Abyss_Imp.png",                w:32, h:32, frames:2 },
  abyss_lurker:      { file:"Abyss_Lurker.png",             w:32, h:32, frames:2 },
  abyss_minion:      { file:"Abyss_Minion.png",             w:32, h:32, frames:2 },
  abyss_monster:     { file:"Abyss_Monster.png",            w:32, h:32, frames:2 },
  abyss_reaper:      { file:"Abyss_Reaper.png",             w:32, h:32, frames:2 },
  abyss_siren1:      { file:"Abyss_Siren_form_1.png",       w:32, h:32, frames:2 },
  abyss_siren2:      { file:"Abyss_Siren_form_2.png",       w:32, h:32, frames:2 },
  abyss_siren3:      { file:"Abyss_Siren_form_3.png",       w:64, h:64, frames:4 },
  abyss_slug:        { file:"Abyss_Slug.png",               w:32, h:32, frames:4 },
  shell_tortoise3:   { file:"Shell_Tortoise_form_3.png",    w:64, h:64, frames:4 },
  volcano_drakling:  { file:"Volcano_Drakling.png",         w:64, h:64, frames:4 },
  volcano_imp:       { file:"Volcano_Imp.png",              w:32, h:32, frames:2 },
  wierd_traveler:    { file:"Wierd_Traveler.png",           w:32, h:32, frames:2 },
  wisp_wraith1:      { file:"Wisp_Wraith_1.png",            w:32, h:32, frames:2 },
  wisp_wraith2:      { file:"Wisp_Wraith_2.png",            w:32, h:32, frames:2 },
  wisp_wraith3:      { file:"Wisp_Wraith_3.png",            w:48, h:48, frames:2 },
  wisp_wraith4:      { file:"Wisp_Wraith_4.png",            w:32, h:32, frames:2 },
  cave_troll_boss:   { file:"Cave_Troll_Boss.png",           w:64, h:64, frames:4 },
  cave_tiny_troll:   { file:"Cave_Tiny_Troll.png",           w:32, h:32, frames:2 },
  abyss_squid:       { file:"Abyss_Squid.png",               w:32, h:32, frames:2 },
  abyss_tiny_slug:   { file:"Abyss_Tiny_Slug.png",           w:32, h:32, frames:4 },
  chaos_druid:       { file:"Chaos_Druid.png",               w:48, h:48, frames:4 },
  chaos_imp:         { file:"Chaos_Imp.png",                 w:32, h:32, frames:3 },
  chaos_weaver:      { file:"Chaos_Weaver.png",              w:32, h:32, frames:3 },
  clockwork_behemoth:{ file:"Clockwork_Behemoth.png",        w:48, h:48, frames:2 },
  clockwork_imp:     { file:"Clockwork_Imp.png",             w:32, h:32, frames:2 },
  clockwork_soldier: { file:"Clockwork_Soldier.png",         w:32, h:32, frames:2 },
  dust_elemental:    { file:"Dust_Elemental.png",            w:32, h:32, frames:3 },
  dust_elemental_boss:{ file:"Dust_Elemental_Boss.png",      w:64, h:64, frames:4 },
  dust_explosioniate:{ file:"Dust_Explosioniate.png",        w:32, h:32, frames:4 },
  fire_imp:          { file:"Fire_Imp.png",                  w:32, h:32, frames:3 },
  fire_elemental:    { file:"Fire_Elemental.png",             w:32, h:32, frames:4 },
  forest_bushling:   { file:"Forest_Bushling.png",           w:32, h:32, frames:4 },
  forest_boss_imp:   { file:"Forest_Boss_Imp.png",           w:48, h:48, frames:3 },
  forest_girl:       { file:"Forest_Girl.png",                w:32, h:32, frames:3 },
  forest_healing_imp:{ file:"Forest_Healing_Imp.png",        w:32, h:32, frames:2 },
};
Object.values(MONSTER_SPRITES).forEach(m=>{
  m.img = new Image();
  m.loaded = false;
  m.img.onload = ()=>{ m.loaded = true; };
  m.img.src = "assets/monsters/" + m.file;
});

const DUNGEON_MONSTER_POOL = {
  1: ["green_blob","lime","happy_blob","forest_bushling","forest_girl","forest_healing_imp","forest_boss_imp"],
  2: ["large_snake","shell_tortoise","shell_tortoise3","giant_turtle"],
  3: ["goblin_cutthroat","skeleton","skeleton_spearman","skeleton_warrior","skeletal_rat","skeletal_rat_boss"],
  4: ["mirrorfiend","stone_slug","cave_troll","cave_tiny_troll","dust_elemental","dust_explosioniate","cave_troll_boss"],
  5: ["mirrorfiend","spectral_hound","spectral_hound2","spectral_harvester","wisp_wraith1","wisp_wraith2","wisp_wraith3","wisp_wraith4","chaos_druid","chaos_imp","chaos_weaver","graveyard_guardian"],
  6: ["toxic_small_pile","toxic_pile","toxic_slime","toxic_wisp","toxic_skeleton","suspicious_blob","tiny_spider","tick","spiderling_leader","large_snake","giant_spider","volcano_drakling","volcano_drake_boss"],
  7: ["jy_goblin","jy_tinyboxer","jy_boxer","jy_skeleton","jy_brute","jy_golem","jy_goliath","jy_buffed_titan","clockwork_imp","clockwork_soldier","clockwork_behemoth","dust_elemental_boss","jy_titan"],
  8: ["frost_yetling","frost_ice_buff"],
  9: ["abyss_druid","abyss_fat_gargoyle","abyss_goblin","abyss_imp","abyss_lurker","abyss_minion","abyss_monster","abyss_slug","abyss_squid","abyss_tiny_slug","volcano_imp","fire_imp","fire_elemental","abyss_reaper"],
  10:["abyss_siren3"],
};
function pickMonsterSprite(dungeonId, isBoss){
  const pool = DUNGEON_MONSTER_POOL[dungeonId] || ["green_blob"];
  if(isBoss) return pool[pool.length-1];
  const regularPool = pool.length>1 ? pool.slice(0,-1) : pool;
  return regularPool[Math.floor(Math.random()*regularPool.length)];
}
function drawMonsterSprite(ctx, key, x, y, displaySize, animate){
  const m = MONSTER_SPRITES[key];
  if(!m || !m.loaded){
    ctx.font=(displaySize*0.7)+"px serif"; ctx.textAlign="center";
    ctx.fillText("👺", x, y);
    return;
  }
  const frame = animate ? Math.floor(Date.now()/280)%m.frames : 0;
  const sx = frame*m.w;
  ctx.drawImage(m.img, sx, 0, m.w, m.h, x-displaySize/2, y-displaySize+displaySize*0.15, displaySize, displaySize);
}

/* ============================== DATA: TIER (item) ============================== */

const TIERS = [
  { key:"kayu",       name:"Kayu",       mult:1.0,  price:0,     rarity:0 },
  { key:"perunggu",   name:"Perunggu",   mult:1.5,  price:60,    rarity:1 },
  { key:"besi",       name:"Besi",       mult:2.1,  price:180,   rarity:2 },
  { key:"baja",       name:"Baja",       mult:2.9,  price:450,   rarity:3 },
  { key:"perak",      name:"Perak",      mult:3.8,  price:950,   rarity:4 },
  { key:"emas",       name:"Emas",       mult:4.9,  price:1900,  rarity:5 },
  { key:"mithril",    name:"Mithril",    mult:6.2,  price:3600,  rarity:6 },
  { key:"adamantit",  name:"Adamantit",  mult:7.8,  price:6800,  rarity:7 },
  { key:"naga",       name:"Naga",       mult:9.8,  price:13000, rarity:8 },
  { key:"legendaris", name:"Legendaris", mult:12.5, price:26000, rarity:9 },
  { key:"mistis",     name:"Mistis",     mult:16.0, price:42000, rarity:10, crystalReq:"legendaris", crystalCost:3 },
];
// Perluas jadi 50 tingkat untuk item spesial (Busur, Tongkat Sihir, Perisai)
function extendTiers(base, targetCount){
  const out = base.map(t=>({...t}));
  let lastMult = base[base.length-1].mult;
  let lastPrice = base[base.length-1].price;
  for(let i=base.length; i<targetCount; i++){
    lastMult = +(lastMult*1.11).toFixed(2);
    lastPrice = Math.round(lastPrice*1.28);
    const specialCrystal = (i%8===0);
    out.push({
      key:`plus${i+1}`,
      name:`Tingkat+${i+1-base.length}`,
      mult:lastMult,
      price:lastPrice,
      rarity:i,
      crystalReq: specialCrystal ? "mistis" : null,
      crystalCost: specialCrystal ? (1+Math.floor((i-base.length)/10)) : 0
    });
  }
  return out;
}
const TIERS_EXT = extendTiers(TIERS, 50); // 50 tingkat

// Bonus stat acak-tapi-tetap (deterministik) untuk sebagian tingkat: crit%, bonus HP, bonus DEF/ATK
function tierBonus(rarity, category){
  const b = {};
  if(rarity>=2){
    if(rarity%3===0) b.crit = Math.min(40, 2+Math.round(rarity*1.15));
    if(rarity%4===0) b.bonusHp = Math.round(rarity*8);
    if(category==="armor" && rarity%5===0) b.bonusDef = Math.round(2+rarity*0.7);
    if(category==="weapon" && rarity%6===0) b.bonusAtk = Math.round(2+rarity*0.5);
  }
  return b;
}

const WEAPON_TYPES = [
  { name:"Pedang",        icon:"🗡️", baseAtk:5 },
  { name:"Kapak",         icon:"🪓", baseAtk:7 },
  { name:"Tombak",        icon:"🔱", baseAtk:6 },
  { name:"Busur",         icon:"🏹", baseAtk:4 },
  { name:"Belati",        icon:"🔪", baseAtk:3 },
  { name:"Palu Perang",   icon:"🔨", baseAtk:8 },
  { name:"Tongkat Sihir", icon:"🪄", baseAtk:5 },
];
const ARMOR_TYPES = [
  { name:"Helm",           icon:"🪖", baseDef:3 },
  { name:"Zirah Dada",     icon:"👘", baseDef:6 },
  { name:"Sarung Tangan",  icon:"🧤", baseDef:2 },
  { name:"Sepatu Baja",    icon:"🥾", baseDef:2 },
  { name:"Perisai",        icon:"🛡️", baseDef:5 },
];
const AMULET_ELEMENTS = [
  { name:"Api",    icon:"🔥" }, { name:"Es",     icon:"❄️" },
  { name:"Petir",  icon:"⚡" }, { name:"Racun",  icon:"☠️" },
  { name:"Suci",   icon:"✨" }, { name:"Gelap",  icon:"🌑" },
  { name:"Angin",  icon:"🌪️" }, { name:"Bumi",   icon:"🌍" },
  { name:"Waktu",  icon:"⏳" }, { name:"Darah",  icon:"🩸" },
];
const AMULET_TIERS = [
  { key:"biasa",      name:"Biasa",      mult:1.0, price:200 },
  { key:"langka",     name:"Langka",     mult:1.8, price:1200 },
  { key:"epik",       name:"Epik",       mult:3.0, price:5000 },
  { key:"mistis",     name:"Mistis",     mult:5.0, price:18000 },
  { key:"legendaris", name:"Legendaris", mult:8.0, price:40000 },
];

function genWeapons(){
  const out = [];
  WEAPON_TYPES.forEach(t=>{
    const special = (t.name==="Busur" || t.name==="Tongkat Sihir");
    const list = special ? TIERS_EXT : TIERS;
    list.forEach(tier=>{
      const bonus = tierBonus(tier.rarity, "weapon");
      out.push({
        id:`w_${t.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"weapon",
        name:`${tier.name} ${t.name}`,
        icon:t.icon,
        atk: Math.round(t.baseAtk*tier.mult),
        price: tier.price,
        tier: tier.key,
        rarity: tier.rarity,
        crystalReq: tier.crystalReq||null,
        crystalCost: tier.crystalCost||0,
        starter: tier.key==="kayu",
        crit: bonus.crit||0,
        bonusHp: bonus.bonusHp||0,
        bonusAtk: bonus.bonusAtk||0,
      });
    });
  });
  return out;
}
function genArmors(){
  const out = [];
  ARMOR_TYPES.forEach(t=>{
    const special = (t.name==="Perisai");
    const list = special ? TIERS_EXT : TIERS;
    list.forEach(tier=>{
      const bonus = tierBonus(tier.rarity, "armor");
      out.push({
        id:`a_${t.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"armor",
        name:`${tier.name} ${t.name}`,
        icon:t.icon,
        def: Math.round(t.baseDef*tier.mult),
        price: tier.price,
        tier: tier.key,
        rarity: tier.rarity,
        crystalReq: tier.crystalReq||null,
        crystalCost: tier.crystalCost||0,
        starter: tier.key==="kayu",
        crit: bonus.crit||0,
        bonusHp: bonus.bonusHp||0,
        bonusDef: bonus.bonusDef||0,
      });
    });
  });
  return out;
}
function genAmulets(){
  const out = [];
  AMULET_ELEMENTS.forEach(e=>{
    AMULET_TIERS.forEach((tier,ti)=>{
      const bonus = tierBonus(ti, "amulet");
      out.push({
        id:`m_${e.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"amulet",
        name:`${tier.name} Amulet ${e.name}`,
        icon:e.icon,
        element: e.name,
        atk: Math.round(4*tier.mult),
        def: Math.round(2*tier.mult),
        price: tier.price,
        tier: tier.key,
        crit: (e.name==="Petir"||e.name==="Darah") ? Math.round(4+ti*3) : (bonus.crit||0),
        bonusHp: bonus.bonusHp||0,
      });
    });
  });
  return out;
}

const WEAPONS = genWeapons();
const ARMORS  = genArmors();
const AMULETS = genAmulets();

const POTIONS = [
  {id:"p_heal_kecil", name:"Ramuan Penyembuh Kecil", icon:"🧪", effect:"heal", value:30, price:20},
  {id:"p_heal_sedang", name:"Ramuan Penyembuh Sedang", icon:"🧪", effect:"heal", value:70, price:55},
  {id:"p_heal_besar", name:"Ramuan Penyembuh Besar", icon:"🧪", effect:"heal", value:150, price:130},
  {id:"p_heal_super", name:"Ramuan Penyembuh Super", icon:"🧪", effect:"heal", value:300, price:280},
  {id:"p_heal_penuh", name:"Ramuan Penyembuh Total", icon:"💠", effect:"healfull", value:9999, price:600},
  {id:"p_atk_kecil", name:"Ramuan Kekuatan Kecil", icon:"🔴", effect:"buffAtk", value:5, duration:3, price:40},
  {id:"p_atk_sedang", name:"Ramuan Kekuatan Sedang", icon:"🔴", effect:"buffAtk", value:12, duration:3, price:100},
  {id:"p_atk_besar", name:"Ramuan Kekuatan Besar", icon:"🔴", effect:"buffAtk", value:25, duration:3, price:250},
  {id:"p_def_kecil", name:"Ramuan Pertahanan Kecil", icon:"🔵", effect:"buffDef", value:4, duration:3, price:40},
  {id:"p_def_sedang", name:"Ramuan Pertahanan Sedang", icon:"🔵", effect:"buffDef", value:10, duration:3, price:100},
  {id:"p_def_besar", name:"Ramuan Pertahanan Besar", icon:"🔵", effect:"buffDef", value:20, duration:3, price:250},
  {id:"p_antidot", name:"Penawar Racun", icon:"🟢", effect:"cure", value:0, price:35},
  {id:"p_kecepatan", name:"Ramuan Kecepatan", icon:"🟡", effect:"dodgeBoost", value:15, duration:3, price:120},
  {id:"p_keberuntungan", name:"Ramuan Keberuntungan", icon:"🍀", effect:"luck", value:10, duration:5, price:150},
  {id:"p_darah_naga", name:"Darah Naga", icon:"🩸", effect:"heal", value:500, price:900},
  {id:"p_air_suci", name:"Air Suci", icon:"💧", effect:"healfull", value:9999, price:1200},
  {id:"p_elixir", name:"Elixir Misterius", icon:"⚗️", effect:"buffAll", value:15, duration:4, price:1600},
  {id:"p_revive", name:"Batu Kebangkitan", icon:"🪨", effect:"revive", value:0, price:2500},
  {id:"p_madu_hutan", name:"Madu Hutan Purba", icon:"🍯", effect:"heal", value:90, price:70},
  {id:"p_ramuan_beku", name:"Ramuan Anti Beku", icon:"🧊", effect:"cure", value:0, price:35},
  {id:"p_teh_herbal", name:"Teh Herbal Guild", icon:"🍵", effect:"heal", value:45, price:30},
  {id:"p_serum_baja", name:"Serum Kulit Baja", icon:"🥤", effect:"buffDef", value:35, duration:3, price:500},
  {id:"p_bubuk_kilat", name:"Bubuk Kilat", icon:"✨", effect:"dodgeBoost", value:30, duration:2, price:400},
  {id:"p_darah_iblis", name:"Darah Iblis", icon:"🔺", effect:"buffAtk", value:40, duration:3, price:700},
];

/* ============================== DATA: SKILL TREE ============================== */

const SKILL_ELEMENTS = [
  "Api","Es","Petir","Racun","Suci","Gelap","Angin","Bumi","Waktu","Darah","Cahaya","Baja"
];
const SKILL_LEVELS = [
  {name:"Kecil",   mult:1.4, cd:1, cost:1},
  {name:"Sedang",  mult:2.0, cd:2, cost:1},
  {name:"Besar",   mult:2.8, cd:2, cost:2},
  {name:"Dahsyat", mult:3.8, cd:3, cost:2},
  {name:"Ultimate",mult:5.2, cd:4, cost:3},
];
const UNIQUE_SKILLS = [
  "Amukan Naga","Tebasan Seribu","Panah Penembus Jiwa","Cakar Bayangan",
  "Ledakan Kristal","Pukulan Bumi Retak","Badai Es Abadi","Sabetan Cahaya Suci",
  "Rantai Petir Ganas","Wabah Mematikan","Pusaran Waktu","Darah Mendidih",
  "Tinju Titan","Sayap Kegelapan","Nafas Naga Purba","Genggaman Maut",
  "Reruntuhan Bintang","Jerit Malaikat Jatuh"
];

function genSkills(){
  const out = [];
  SKILL_ELEMENTS.forEach(el=>{
    SKILL_LEVELS.forEach((lv,i)=>{
      out.push({
        id:`sk_${el}_${lv.name}`,
        type:"attack",
        element: el,
        name:`${lv.name} Serangan ${el}`,
        mult: lv.mult,
        cd: lv.cd,
        source: "tree",
        branch: `el_${el}`,
        tier: i,
        cost: lv.cost,
        desc:`Serangan elemen ${el} tingkat ${lv.name}.`
      });
    });
  });
  WEAPON_TYPES.forEach(w=>{
    ["Mahir","Ahli","Master"].forEach((rank,i)=>{
      out.push({
        id:`sk_mastery_${w.name}_${rank}`,
        type:"passive",
        name:`${w.name} ${rank}`,
        bonusAtk: 4*(i+1),
        source:"tree",
        branch:`wm_${w.name}`,
        tier: i,
        cost: [1,2,3][i],
        weapon: w.name,
        desc:`Bonus serangan tetap saat memakai ${w.name}.`
      });
    });
  });
  UNIQUE_SKILLS.forEach((name,i)=>{
    out.push({
      id:`sk_unique_${i}`,
      type:"attack",
      element:"Unik",
      name,
      mult: 4.5 + i*0.3,
      cd: 3,
      source:"boss",
      desc:`Jurus rahasia hasil kalahkan bos: ${name}.`
    });
  });
  return out;
}
const SKILLS = genSkills();
function skillBranchChain(branch){
  return SKILLS.filter(s=>s.branch===branch).sort((a,b)=>a.tier-b.tier);
}
function skillTreeBranches(){
  const branches = {};
  SKILLS.filter(s=>s.source==="tree").forEach(s=>{
    branches[s.branch] = branches[s.branch]||[];
    branches[s.branch].push(s);
  });
  Object.values(branches).forEach(arr=>arr.sort((a,b)=>a.tier-b.tier));
  return branches;
}
function canLearnTreeSkill(s){
  if(player.skills.includes(s.id)) return false;
  if(player.skillPoints < s.cost) return false;
  if(s.tier>0){
    const chain = skillBranchChain(s.branch);
    const prev = chain[s.tier-1];
    if(!prev || !player.skills.includes(prev.id)) return false;
  }
  return true;
}
function learnTreeSkill(id){
  const s = getSkill(id);
  if(!s || !canLearnTreeSkill(s)) return;
  player.skills.push(id);
  player.skillPoints -= s.cost;
  persist();
  renderSkillTree();
}

/* ============================== DATA: DUNGEON ============================== */

const DUNGEONS = [
  { id:1, name:"Hutan Pertama",          element:"Bumi",   boss:"Raja Serigala Tunggul", monsterName:"Serigala Hutan" },
  { id:2, name:"Hutan Rawa",             element:"Racun",  boss:"Ratu Lintah Rawa",      monsterName:"Siluman Rawa" },
  { id:3, name:"Hutan Kematian",         element:"Gelap",  boss:"Penjaga Hutan Terkutuk",monsterName:"Mayat Berjalan" },
  { id:4, name:"Gua Kristal",            element:"Bumi",   boss:"Golem Kristal Purba",   monsterName:"Kelelawar Kristal" },
  { id:5, name:"Reruntuhan Kuno",        element:"Waktu",  boss:"Penjaga Reruntuhan",    monsterName:"Patung Hidup" },
  { id:6, name:"Lembah Beracun",         element:"Racun",  boss:"Naga Rawa Beracun",     monsterName:"Kalajengking Raksasa" },
  { id:7, name:"Benteng Terbengkalai",   element:"Baja",   boss:"Kesatria Baja Terkutuk",monsterName:"Prajurit Bayangan" },
  { id:8, name:"Puncak Es Abadi",        element:"Es",     boss:"Naga Es Abadi",         monsterName:"Serigala Es" },
  { id:9, name:"Jurang Neraka",          element:"Api",    boss:"Iblis Penjaga Jurang",  monsterName:"Iblis Kecil" },
  { id:10,name:"Singgasana Sang Penguasa Kegelapan", element:"Gelap", boss:"Penguasa Kegelapan", monsterName:null, finalBoss:true },
];
function dungeonFloors(id){ if(id<=5) return 5; if(id<=9) return 10; return 1; }
function monstersPerSubfloor(id){ return 4+id; }
function difficultyValue(dungeonId, subFloor){
  const total = dungeonFloors(dungeonId);
  return dungeonId + (subFloor-1)/Math.max(1,total);
}

const BOSS_DIALOGUE = {
  "Raja Serigala Tunggul": ["Grrrhh... manusia berani masuk wilayahku!","Rasakan gigitan terakhirmu!"],
  "Ratu Lintah Rawa": ["Rawa ini akan menjadi kuburanmu...","Darahmu akan jadi santapanku!"],
  "Penjaga Hutan Terkutuk": ["Kutukan ini... akan menular padamu juga.","Kegelapan tak pernah tidur..."],
  "Golem Kristal Purba": ["...INTRUSI TERDETEKSI...","...MENGHANCURKAN..."],
  "Penjaga Reruntuhan": ["Waktu telah melupakanku, tapi aku tidak lupa caramu menghancurkanku!"],
  "Naga Rawa Beracun": ["Hirup racunku, manusia lemah!","Kau akan membusuk perlahan..."],
  "Kesatria Baja Terkutuk": ["Baju zirah ini menyimpan seribu jiwa yang gagal sepertimu.","Bergabunglah dengan mereka!"],
  "Naga Es Abadi": ["Ribuan tahun aku membeku di sini... kini giliranmu.","Rasakan dinginnya kematian!"],
  "Iblis Penjaga Jurang": ["Jurang ini adalah pintu neraka, dan kau tamunya!","Api ini tak akan pernah padam!"],
  "Penguasa Kegelapan": [
    "Akhirnya... seseorang berhasil sampai sejauh ini.",
    "Kau membawa kristal-kristal itu... menarik.",
    "Tapi keberanianmu berakhir di sini, pengelana.",
    "Rasakan kekuatan kegelapan sejati!"
  ]
};

/* ============================== DATA: KRISTAL ============================== */

const CRYSTAL_TYPES = [
  { key:"biasa",      name:"Kristal Biasa",      icon:"🔹", sellRate:10 },
  { key:"langka",     name:"Kristal Langka",     icon:"🔷", sellRate:80 },
  { key:"epik",       name:"Kristal Epik",       icon:"💎", sellRate:500 },
  { key:"mistis",     name:"Kristal Mistis",     icon:"🟣", sellRate:3000 },
  { key:"legendaris", name:"Kristal Legendaris", icon:"🌟", sellRate:20000 },
  { key:"dewa",       name:"Kristal Dewa",       icon:"👑", sellRate:150000 },
];

/* ============================== CURRENCY HELPERS ============================== */
function coinToDisplay(totalPerunggu){
  let sisa = totalPerunggu;
  const platinum = Math.floor(sisa/1000000); sisa -= platinum*1000000;
  const gold = Math.floor(sisa/10000); sisa -= gold*10000;
  const perak = Math.floor(sisa/100); sisa -= perak*100;
  const perunggu = sisa;
  return {platinum, gold, perak, perunggu};
}
function formatCoin(totalPerunggu){
  const c = coinToDisplay(totalPerunggu);
  const parts = [];
  if(c.platinum) parts.push(`${c.platinum}P`);
  if(c.gold) parts.push(`${c.gold}G`);
  if(c.perak) parts.push(`${c.perak}S`);
  parts.push(`${c.perunggu}C`);
  return parts.join(" ");
}

/* ============================== AKUN & LOGIN ============================== */

const STORAGE_KEY = "kristalsaga_accounts_v1";
function loadAccounts(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ return {}; }
}
function saveAccounts(acc){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(acc));
}
let ACCOUNTS = loadAccounts();
let player = null;

function xpForLevel(lvl){ return Math.round(35*Math.pow(lvl,1.45)); }
function computeMaxHp(p){
  p = p || player;
  let hp = 80 + p.level*12;
  const w = getWeapon(p.equipped.weapon), a = getArmor(p.equipped.armor), am = getAmulet(p.equipped.amulet);
  [w,a,am].forEach(it=>{ if(it && it.bonusHp) hp += it.bonusHp; });
  return hp;
}

function makeNewPlayer(username, email){
  const p = {
    username, email,
    level:1, xp:0, skillPoints:0,
    hp:100, maxHp:100,
    baseAtk:3, baseDef:1,
    coins:0,
    crystals:{ biasa:0, langka:0, epik:0, mistis:0, legendaris:0, dewa:0 },
    inventory:{ weapons:["w_Pedang_kayu"], armors:[], amulets:[], potions:{"p_heal_kecil":1} },
    equipped:{ weapon:"w_Pedang_kayu", armor:null, amulet:null },
    skills:[],
    maxFloorReached:0,
    dungeonCleared:{},
    dungeonSubProgress:{},
    currentFloor:0, // 0 = lobby, else id dungeon 1-10
    currentSubFloor:1,
    floorProgress:{}, // {"dungeonId_subFloor": monstersKilled}
    pos:{x:400,y:300},
    facing:"down",
    isMoving:false,
    upgradeLevels:{},
  };
  p.maxHp = computeMaxHp(p);
  p.hp = p.maxHp;
  return p;
}
function getUpgradeLevel(itemId){ return (player.upgradeLevels && player.upgradeLevels[itemId]) || 0; }

function registerAccount(username, password, email){
  if(ACCOUNTS[username]) return {ok:false, msg:"Username sudah terdaftar."};
  if(!username || !password) return {ok:false, msg:"Username & sandi wajib diisi."};
  ACCOUNTS[username] = { password, email, save: makeNewPlayer(username, email) };
  saveAccounts(ACCOUNTS);
  return {ok:true};
}
function loginAccount(username, password){
  const acc = ACCOUNTS[username];
  if(!acc) return {ok:false, msg:"Akun tidak ditemukan."};
  if(acc.password !== password) return {ok:false, msg:"Sandi salah."};
  player = acc.save;
  // migrasi save lama yang belum punya field baru
  if(player.level===undefined) player.level=1;
  if(player.xp===undefined) player.xp=0;
  if(player.skillPoints===undefined) player.skillPoints=0;
  if(player.currentSubFloor===undefined) player.currentSubFloor=1;
  if(!player.floorProgress) player.floorProgress={};
  if(!player.dungeonCleared) player.dungeonCleared={};
  if(!player.dungeonSubProgress) player.dungeonSubProgress={};
  if(player.skills) player.skills = player.skills.filter(id=> id.indexOf("sk_dodge")!==0 );
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp = player.maxHp;
  return {ok:true};
}
function persist(){
  if(!player) return;
  if(!ACCOUNTS[player.username]) ACCOUNTS[player.username] = {password:"", email:player.email, save:player};
  ACCOUNTS[player.username].save = player;
  saveAccounts(ACCOUNTS);
}

/* ============================== ITEM LOOKUP HELPERS ============================== */
function getWeapon(id){ return WEAPONS.find(w=>w.id===id); }
function getArmor(id){ return ARMORS.find(a=>a.id===id); }
function getAmulet(id){ return AMULETS.find(a=>a.id===id); }
function getPotion(id){ return POTIONS.find(p=>p.id===id); }
function getSkill(id){ return SKILLS.find(s=>s.id===id); }

function playerTotalAtk(){
  let atk = player.baseAtk;
  const w = getWeapon(player.equipped.weapon);
  if(w){ atk += w.atk + getUpgradeLevel(w.id)*4; atk += (w.bonusAtk||0); }
  const a = getArmor(player.equipped.armor);
  if(a) atk += (a.bonusAtk||0);
  const am = getAmulet(player.equipped.amulet);
  if(am) atk += am.atk + (am.bonusAtk||0);
  atk += getWeaponMasteryBonus();
  return atk;
}
function getWeaponMasteryBonus(){
  const w = getWeapon(player.equipped.weapon);
  if(!w) return 0;
  const wtype = WEAPON_TYPES.find(t=> w.name.endsWith(t.name));
  if(!wtype) return 0;
  let bonus = 0;
  player.skills.forEach(sid=>{
    const s = getSkill(sid);
    if(s && s.type==="passive" && s.weapon===wtype.name) bonus = Math.max(bonus, s.bonusAtk);
  });
  return bonus;
}
function playerTotalDef(){
  let def = player.baseDef;
  const w = getWeapon(player.equipped.weapon);
  if(w) def += (w.bonusDef||0);
  const a = getArmor(player.equipped.armor);
  if(a){ def += a.def + getUpgradeLevel(a.id)*3; def += (a.bonusDef||0); }
  const am = getAmulet(player.equipped.amulet);
  if(am) def += am.def + (am.bonusDef||0);
  return def;
}
function playerTotalCrit(){
  let c = 0;
  const w = getWeapon(player.equipped.weapon); if(w) c += (w.crit||0);
  const a = getArmor(player.equipped.armor); if(a) c += (a.crit||0);
  const am = getAmulet(player.equipped.amulet); if(am) c += (am.crit||0);
  return c;
}

/* ============================== DAMAGE FORMULA ============================== */
// Mitigasi persentase (diminishing returns) supaya defense tinggi tidak membuat damage nyaris 0,
// tapi tetap terasa berarti. dmg efektif = atk * 12/(12+def)
function mitigatedDamage(atk, def){
  const mitig = Math.max(0, def) / (Math.max(0,def) + 12);
  return Math.max(1, Math.round(atk * (1-mitig)));
}

/* ============================== MONSTER ============================== */

function makeMonster(dungeonId, subFloor, isBoss, forcedSpriteKey){
  const d = DUNGEONS.find(x=>x.id===dungeonId);
  const diff = difficultyValue(dungeonId, subFloor);
  const baseHp = 25 * Math.pow(diff, 1.32);
  const baseAtk = 4 * Math.pow(diff, 1.18);
  const baseDef = 2 * Math.pow(diff, 1.05);
  const mult = isBoss ? 6 : 1;
  return {
    name: isBoss ? d.boss : d.monsterName,
    spriteKey: forcedSpriteKey || pickMonsterSprite(dungeonId, isBoss),
    isBoss,
    dungeonId, subFloor, diff,
    element: d.element,
    hp: Math.round(baseHp*mult),
    maxHp: Math.round(baseHp*mult),
    atk: Math.round(baseAtk*(isBoss?2.2:1)),
    def: Math.round(baseDef*(isBoss?1.6:1)),
    dialogueIndex: 0,
  };
}

/* ============================== SKILL / LEVEL LOGIC ============================== */

function tryLearnSkill(id){
  if(!player.skills.includes(id)){
    player.skills.push(id);
    return getSkill(id);
  }
  return null;
}
function onMonsterKilled(monster){
  const learned = [];
  if(monster.isBoss){
    const uniqPool = SKILLS.filter(s=>s.source==="boss" && !player.skills.includes(s.id));
    if(uniqPool.length){
      const pick = uniqPool[Math.floor(Math.random()*uniqPool.length)];
      const l = tryLearnSkill(pick.id);
      if(l) learned.push(l);
    }
  }
  return learned;
}
function grantXp(amount){
  player.xp += amount;
  const leveled = [];
  while(player.xp >= xpForLevel(player.level)){
    player.xp -= xpForLevel(player.level);
    player.level++;
    player.skillPoints += 1;
    player.baseAtk += 1;
    if(player.level%2===0) player.baseDef += 1;
    leveled.push(player.level);
  }
  if(leveled.length){
    player.maxHp = computeMaxHp();
    player.hp = player.maxHp;
  }
  return leveled;
}

/* ============================== KRISTAL DROP ============================== */

function rollCrystalDrop(monster){
  const f = monster.diff;
  const r = Math.random();
  let key = "biasa";
  const bossBonus = monster.isBoss ? 0.25 : 0;
  const p = r - bossBonus - f*0.01;
  if(p < 0.015) key = "dewa";
  else if(p < 0.05) key = "legendaris";
  else if(p < 0.16) key = "mistis";
  else if(p < 0.42) key = "epik";
  else if(p < 0.75) key = "langka";
  else key = "biasa";
  const qty = monster.isBoss ? (1+Math.floor(Math.random()*3)) : 1;
  player.crystals[key] += qty;
  return {key, qty};
}

/* ============================== BATTLE STATE ============================== */

let battle = null;
let battleSpriteRAF = null;
function startBattle(monster){
  battle = {
    monster,
    log: [`${monster.name} muncul di hadapanmu!`],
    playerBuffs: { atk:0, def:0, turnsLeft:0, dodgeBoost:0, dodgeTurns:0 },
    skillCooldowns: {},
    ended:false,
    talked: false,
  };
  showScreen("screen-battle");
  renderBattle();
  runEnemySpriteLoop();
}
function runEnemySpriteLoop(){
  if(battleSpriteRAF) cancelAnimationFrame(battleSpriteRAF);
  const canvas = document.getElementById("enemy-sprite-canvas");
  const ctx = canvas.getContext("2d");
  function loop(){
    if(document.getElementById("screen-battle").style.display==="none" || !battle){ return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const size = battle.monster.isBoss ? 120 : 90;
    drawMonsterSprite(ctx, battle.monster.spriteKey, canvas.width/2, canvas.height/2+size/2-10, size, true);
    battleSpriteRAF = requestAnimationFrame(loop);
  }
  loop();
}
function battleLog(msg){
  battle.log.push(msg);
  if(battle.log.length>6) battle.log.shift();
  const el = document.getElementById("battle-log");
  if(el) el.innerHTML = battle.log.map(l=>`<div>${l}</div>`).join("");
}
function currentPlayerAtk(){ return playerTotalAtk() + battle.playerBuffs.atk; }
function currentPlayerDef(){ return playerTotalDef() + battle.playerBuffs.def; }
function tickBuffs(){
  const b = battle.playerBuffs;
  if(b.turnsLeft>0){ b.turnsLeft--; if(b.turnsLeft===0){ b.atk=0; b.def=0; } }
  if(b.dodgeTurns>0){ b.dodgeTurns--; if(b.dodgeTurns===0) b.dodgeBoost=0; }
  Object.keys(battle.skillCooldowns).forEach(k=>{ if(battle.skillCooldowns[k]>0) battle.skillCooldowns[k]--; });
}

/* ---------- TIMING BAR (serangan ala Undertale) ---------- */
// Zona kuning (::before di CSS: 42%-58%) = KRITIS. Sisanya (hitam) = normal.
const CRIT_ZONE_HALFWIDTH = 8; // 50 +/- 8 => 42-58, cocok dgn CSS
let timingBarState = null;
function startTimingBar(onResult){
  timingBarState = { pos:0, dir:1, running:true, onResult };
  const track = document.getElementById("timing-track");
  const marker = document.getElementById("timing-marker");
  const legend = document.getElementById("timing-legend");
  track.style.display = "block";
  if(legend) legend.style.display = "block";
  timingBarState.raf = setInterval(()=>{
    timingBarState.pos += timingBarState.dir*4;
    if(timingBarState.pos>=100){ timingBarState.pos=100; timingBarState.dir=-1; }
    if(timingBarState.pos<=0){ timingBarState.pos=0; timingBarState.dir=1; }
    marker.style.left = timingBarState.pos+"%";
  }, 16);
}
function stopTimingBar(){
  if(!timingBarState || !timingBarState.running) return;
  timingBarState.running = false;
  clearInterval(timingBarState.raf);
  document.getElementById("timing-track").style.display = "none";
  const legend = document.getElementById("timing-legend");
  if(legend) legend.style.display = "none";
  const dist = Math.abs(50 - timingBarState.pos);
  let power;
  if(dist<5) power = 1.8;
  else if(dist<15) power = 1.4;
  else if(dist<30) power = 1.0;
  else power = 0.6;
  const zoneCrit = dist <= CRIT_ZONE_HALFWIDTH;
  const cb = timingBarState.onResult;
  timingBarState = null;
  cb(power, zoneCrit);
}

/* ---------- AKSI PEMAIN ---------- */
function playerAttack(){
  if(battle.ended) return;
  document.getElementById("battle-actions").style.display="none";
  startTimingBar((power, zoneCrit)=>{
    const crit = zoneCrit || (Math.random()*100 < playerTotalCrit());
    let dmg = mitigatedDamage(currentPlayerAtk()*power, battle.monster.def||0);
    if(crit) dmg = Math.round(dmg*1.8);
    battle.monster.hp -= dmg;
    const powerLabel = power>=1.6?"SEMPURNA!":power>=1.2?"Bagus!":power>=0.9?"Kena":"Meleset";
    battleLog(`Kamu menyerang! ${dmg} damage${crit?" 💥 KRITIS!":""}. (${powerLabel})`);
    afterPlayerAction();
  });
}
function playerUseSkill(skillId){
  const s = getSkill(skillId);
  if(!s || s.type!=="attack") return;
  if(battle.skillCooldowns[skillId]>0){ battleLog(`${s.name} masih cooldown ${battle.skillCooldowns[skillId]} giliran.`); return; }
  closeSkillMenu();
  document.getElementById("battle-actions").style.display="none";
  startTimingBar((power, zoneCrit)=>{
    const crit = zoneCrit || (Math.random()*100 < playerTotalCrit());
    let dmg = mitigatedDamage(currentPlayerAtk()*s.mult*power*0.6, battle.monster.def||0);
    if(crit) dmg = Math.round(dmg*1.8);
    battle.monster.hp -= dmg;
    battle.skillCooldowns[skillId] = s.cd;
    battleLog(`Kamu memakai ${s.name}! ${dmg} damage elemen ${s.element}${crit?" 💥 KRITIS!":""}.`);
    afterPlayerAction();
  });
}
function playerUseItem(potionId){
  const owned = player.inventory.potions[potionId]||0;
  if(owned<=0) return;
  const p = getPotion(potionId);
  closeItemMenu();
  player.inventory.potions[potionId]--;
  if(p.effect==="heal"){ player.hp = Math.min(player.maxHp, player.hp+p.value); battleLog(`Kamu minum ${p.name}. HP +${p.value}.`); }
  else if(p.effect==="healfull"){ player.hp = player.maxHp; battleLog(`Kamu minum ${p.name}. HP pulih penuh!`); }
  else if(p.effect==="buffAtk"){ battle.playerBuffs.atk+=p.value; battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Serangan meningkat +${p.value}!`); }
  else if(p.effect==="buffDef"){ battle.playerBuffs.def+=p.value; battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Pertahanan meningkat +${p.value}!`); }
  else if(p.effect==="buffAll"){ battle.playerBuffs.atk+=p.value; battle.playerBuffs.def+=Math.round(p.value/2); battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Seluruh kemampuan meningkat!`); }
  else if(p.effect==="dodgeBoost"){ battle.playerBuffs.dodgeBoost+=p.value; battle.playerBuffs.dodgeTurns=Math.max(battle.playerBuffs.dodgeTurns,p.duration); battleLog(`Kelincahanmu meningkat!`); }
  else { battleLog(`Kamu memakai ${p.name}.`); }
  afterPlayerAction();
}
function playerDefend(){
  document.getElementById("battle-actions").style.display="none";
  battle.playerBuffs.def += Math.round(playerTotalDef()*0.5)+3;
  battle.playerBuffs.turnsLeft = Math.max(battle.playerBuffs.turnsLeft,1);
  battleLog("Kamu bersiap bertahan!");
  afterPlayerAction();
}
function playerRun(){
  if(battle.monster.isBoss){ battleLog("Tidak bisa kabur dari Bos!"); return; }
  battleLog("Kamu berhasil kabur!");
  battle.ended = true;
  setTimeout(()=>{ endBattle(false); }, 700);
}
function afterPlayerAction(){
  renderBattle();
  if(battle.monster.hp<=0){
    setTimeout(()=>onMonsterDefeated(), 500);
    return;
  }
  setTimeout(()=> monsterTurn(), 700);
}

/* ---------- GILIRAN MONSTER: DODGE MINIGAME ---------- */
function monsterTurn(){
  tickBuffs();
  if(battle.monster.isBoss){
    const lines = BOSS_DIALOGUE[battle.monster.name];
    if(lines && battle.monster.dialogueIndex < lines.length && Math.random()<0.6){
      battleLog(`💬 ${battle.monster.name}: "${lines[battle.monster.dialogueIndex]}"`);
      battle.monster.dialogueIndex++;
    }
  }
  startDodgePhase();
}

let dodgeGame = null;
function startDodgePhase(){
  const box = document.getElementById("dodge-box");
  box.style.display = "block";
  document.getElementById("battle-actions").style.display="none";
  const w = box.clientWidth, h = box.clientHeight;
  const diff = battle.monster.diff||1;
  const durationMs = 5000 + Math.min(5000, diff*500); // 5-10 detik, makin sulit makin lama
  dodgeGame = {
    player:{x:w/2, y:h-30, w:16, h:16},
    bullets:[],
    ticks: 0,
    maxTicks: Math.round(durationMs/33),
    hit:false,
    speed: Math.min(9, 1.6+diff*0.55),
    spawnEvery: Math.max(5, 20-Math.round(diff*1.3)),
    bulletCountCap: Math.min(10, 2+Math.floor(diff/1.2)),
    keys:{left:false,right:false,up:false,down:false},
  };
  renderDodgePlayer();
  dodgeGame.interval = setInterval(dodgeTick, 33);
}
function dodgeTick(){
  const box = document.getElementById("dodge-box");
  const w = box.clientWidth, h = box.clientHeight;
  const g = dodgeGame;
  g.ticks++;
  const spd = 5;
  if(g.keys.left) g.player.x -= spd;
  if(g.keys.right) g.player.x += spd;
  if(g.keys.up) g.player.y -= spd;
  if(g.keys.down) g.player.y += spd;
  g.player.x = Math.max(8, Math.min(w-8, g.player.x));
  g.player.y = Math.max(8, Math.min(h-8, g.player.y));

  if(g.ticks % g.spawnEvery === 0 && g.ticks < g.maxTicks-20){
    const count = 1 + Math.floor(Math.random()*Math.min(3, g.bulletCountCap));
    for(let i=0;i<count;i++){
      g.bullets.push({ x: Math.random()*w, y: -10, vy: g.speed*(0.8+Math.random()*0.5), vx:(Math.random()-0.5)*1.5 });
    }
  }
  g.bullets.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; });
  g.bullets = g.bullets.filter(b=> b.y < h+20);

  const dodgeReduction = Math.min(0.35, (battle.playerBuffs.dodgeBoost)/150);
  for(const b of g.bullets){
    const dx = b.x-g.player.x, dy=b.y-g.player.y;
    if(Math.sqrt(dx*dx+dy*dy) < 13){
      if(Math.random() < dodgeReduction) continue; // potion kecepatan bisa bikin lolos sesekali
      g.hit = true;
      b.y = h+999;
    }
  }
  renderDodgePlayer();
  if(g.ticks >= g.maxTicks){
    endDodgePhase();
  }
}
function renderDodgePlayer(){
  const box = document.getElementById("dodge-box");
  let html = `<div class="dodge-hero" style="left:${dodgeGame.player.x-9}px; top:${dodgeGame.player.y-9}px;">💠</div>`;
  dodgeGame.bullets.forEach(b=>{
    html += `<div class="dodge-bullet" style="left:${b.x-6}px; top:${b.y-6}px;"></div>`;
  });
  box.innerHTML = html;
}
function endDodgePhase(){
  clearInterval(dodgeGame.interval);
  document.getElementById("dodge-box").style.display="none";
  document.getElementById("dodge-box").innerHTML="";
  if(dodgeGame.hit){
    const dmg = mitigatedDamage(battle.monster.atk, currentPlayerDef());
    player.hp -= dmg;
    battleLog(`💥 Kamu terkena serangan ${battle.monster.name}! -${dmg} HP.`);
  } else {
    battleLog(`✅ Kamu berhasil menghindar semua serangan!`);
  }
  dodgeGame = null;
  renderBattle();
  if(player.hp<=0){ setTimeout(()=>onPlayerDefeated(),500); return; }
  document.getElementById("battle-actions").style.display="flex";
}

/* ---------- AKHIR PERTARUNGAN ---------- */
function onMonsterDefeated(){
  const wasBoss = battle.monster.isBoss;
  const dungeonId = battle.monster.dungeonId;
  const subFloor = battle.monster.subFloor;
  const totalFloors = dungeonFloors(dungeonId);
  battleLog(`${battle.monster.name} dikalahkan!`);
  const drop = rollCrystalDrop(battle.monster);
  battleLog(`Kamu mendapat ${drop.qty}x ${CRYSTAL_TYPES.find(c=>c.key===drop.key).name}!`);
  const xpGain = Math.round((wasBoss?9:1) * (10 + battle.monster.diff*4));
  const leveled = grantXp(xpGain);
  battleLog(`+${xpGain} XP`);
  leveled.forEach(lv=> battleLog(`🌟 Naik ke Level ${lv}! (+1 Poin Skill)`));
  const learned = onMonsterKilled(battle.monster);
  learned.forEach(s=> battleLog(`🎉 Skill baru didapat: ${s.name}!`));
  battle.ended = true;
  const isLastFloor = (dungeonId===10) || (subFloor>=totalFloors);
  if(!wasBoss){
    const key = dungeonId+"_"+subFloor;
    player.floorProgress[key] = (player.floorProgress[key]||0)+1;
  } else {
    if(dungeonId===10){
      battleLog("🏆 SELAMAT! Kamu mengalahkan Penguasa Kegelapan dan menamatkan Kristal Saga!");
      player.dungeonCleared[10] = true;
    } else if(isLastFloor){
      battleLog(`Dungeon ${DUNGEONS.find(x=>x.id===dungeonId).name} berhasil ditaklukkan! Dungeon berikutnya kini terbuka.`);
      player.dungeonCleared[dungeonId] = true;
      player.maxFloorReached = Math.max(player.maxFloorReached, dungeonId+1);
    }
  }
  persist();
  setTimeout(()=>{ endBattle(true); }, 1400);
}
function onPlayerDefeated(){
  battleLog("Kamu tumbang... semua kristal yang kau bawa hilang!");
  player.crystals = { biasa:0, langka:0, epik:0, mistis:0, legendaris:0, dewa:0 };
  player.hp = player.maxHp;
  player.currentFloor = 0;
  persist();
  battle.ended = true;
  setTimeout(()=>{ endBattle(true); goToLobby(); }, 1600);
}
function endBattle(removeMonster){
  const monster = battle.monster;
  battle = null;
  document.getElementById("battle-actions").style.display="flex";
  document.getElementById("timing-track").style.display="none";
  if(player.currentFloor===0){ showScreen("screen-overworld"); renderOverworld(); }
  else { showScreen("screen-dungeon"); if(removeMonster) removeCurrentMonsterSprite(monster); renderDungeon(); }
}

/* ============================== NAVIGASI LAYAR ============================== */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=> s.style.display="none");
  document.getElementById(id).style.display="block";
}

/* ============================== OVERWORLD (LOBBY GUILD) — dgn dinding & pintu ============================== */
const lobbyBg = new Image();
let lobbyBgLoaded = false;
lobbyBg.onload = ()=>{ lobbyBgLoaded = true; };
lobbyBg.src = "assets/lobby_bg.png";

// Setiap bangunan punya dinding padat (w,h) dan pintu sempit di sisi bawah tempat masuk
const LOBBY_BUILDINGS = [
  {name:"Balai Guild",           x:340, y:95,  w:96, h:66,  doorW:26, action:"guild"},
  {name:"Toko Senjata & Armor",  x:182, y:108, w:92, h:64,  doorW:24, action:"shop"},
  {name:"Merchant Ramuan",       x:483, y:108, w:92, h:64,  doorW:24, action:"merchant"},
  {name:"Gerbang Dungeon",       x:611, y:126, w:98, h:70,  doorW:30, action:"dungeon_select"},
  {name:"Penginapan",            x:98,  y:222, w:86, h:60,  doorW:22, action:"inn"},
  {name:"Bank",                  x:451, y:230, w:82, h:58,  doorW:22, action:"bank"},
  {name:"Tukang Besi",           x:568, y:230, w:82, h:58,  doorW:22, action:"blacksmith"},
  {name:"Papan Misi",            x:219, y:362, w:76, h:54,  doorW:20, action:"questboard"},
  {name:"Pasar",                 x:465, y:362, w:82, h:56,  doorW:22, action:"market"},
];
function pointInRect(px,py,r){ return px>r.x-r.w/2 && px<r.x+r.w/2 && py>r.y-r.h/2 && py<r.y+r.h/2; }
function buildingWallRect(b){ return {x:b.x,y:b.y,w:b.w,h:b.h}; }
function buildingDoorZone(b){ return {x:b.x, y:b.y+b.h/2-6, w:b.doorW, h:18}; }
function canMoveInLobby(px,py){
  for(const b of LOBBY_BUILDINGS){
    const wall = buildingWallRect(b);
    const door = buildingDoorZone(b);
    if(pointInRect(px,py,wall) && !pointInRect(px,py,door)) return false;
  }
  return true;
}

let keysHeld = {};
function initKeyboard(){
  window.addEventListener("keydown", e=>{
    const k = e.key.toLowerCase();
    if(["arrowleft","a"].includes(k)) keysHeld.left=true;
    if(["arrowright","d"].includes(k)) keysHeld.right=true;
    if(["arrowup","w"].includes(k)) keysHeld.up=true;
    if(["arrowdown","s"].includes(k)) keysHeld.down=true;
    if(dodgeGame){
      if(["arrowleft","a"].includes(k)) dodgeGame.keys.left=true;
      if(["arrowright","d"].includes(k)) dodgeGame.keys.right=true;
      if(["arrowup","w"].includes(k)) dodgeGame.keys.up=true;
      if(["arrowdown","s"].includes(k)) dodgeGame.keys.down=true;
    }
  });
  window.addEventListener("keyup", e=>{
    const k = e.key.toLowerCase();
    if(["arrowleft","a"].includes(k)) keysHeld.left=false;
    if(["arrowright","d"].includes(k)) keysHeld.right=false;
    if(["arrowup","w"].includes(k)) keysHeld.up=false;
    if(["arrowdown","s"].includes(k)) keysHeld.down=false;
    if(dodgeGame){
      if(["arrowleft","a"].includes(k)) dodgeGame.keys.left=false;
      if(["arrowright","d"].includes(k)) dodgeGame.keys.right=false;
      if(["arrowup","w"].includes(k)) dodgeGame.keys.up=false;
      if(["arrowdown","s"].includes(k)) dodgeGame.keys.down=false;
    }
  });
}
function bindJoystick(prefix, targetKeys){
  ["left","right","up","down"].forEach(dir=>{
    const btn = document.getElementById(`${prefix}-${dir}`);
    if(!btn) return;
    const on = ()=> targetKeys[dir]=true;
    const off = ()=> targetKeys[dir]=false;
    btn.addEventListener("touchstart", e=>{e.preventDefault(); on();});
    btn.addEventListener("touchend", e=>{e.preventDefault(); off();});
    btn.addEventListener("mousedown", on);
    btn.addEventListener("mouseup", off);
    btn.addEventListener("mouseleave", off);
  });
}

let overworldLoop = null;
function renderOverworld(){
  document.getElementById("hud-coins").textContent = formatCoin(player.coins);
  document.getElementById("hud-hp").textContent = `${player.hp}/${player.maxHp}`;
  const lvlEl = document.getElementById("hud-level"); if(lvlEl) lvlEl.textContent = `Lv.${player.level}`;
  const canvas = document.getElementById("overworld-canvas");
  if(overworldLoop) cancelAnimationFrame(overworldLoop);
  function loop(){
    if(document.getElementById("screen-overworld").style.display==="none") return;
    const spd = 3.2;
    let nx = player.pos.x + (keysHeld.right?spd:0) - (keysHeld.left?spd:0);
    nx = Math.max(20, Math.min(680, nx));
    if(canMoveInLobby(nx, player.pos.y)) player.pos.x = nx;
    let ny = player.pos.y + (keysHeld.down?spd:0) - (keysHeld.up?spd:0);
    ny = Math.max(20, Math.min(447, ny));
    if(canMoveInLobby(player.pos.x, ny)) player.pos.y = ny;
    player.isMoving = updateFacingFromKeys(keysHeld);
    drawOverworld(canvas);
    overworldLoop = requestAnimationFrame(loop);
  }
  loop();
}
function drawOverworld(canvas){
  const ctx = canvas.getContext("2d");
  if(lobbyBgLoaded){
    ctx.drawImage(lobbyBg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#1b2a1f"; ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  const merchantB = LOBBY_BUILDINGS.find(b=>b.action==="merchant");
  if(merchantB) drawMonsterSprite(ctx, "wierd_traveler", merchantB.x+50, merchantB.y+45, 32, true);
  drawPlayerSprite(ctx, player.pos.x, player.pos.y, player.facing, player.isMoving);

  LOBBY_BUILDINGS.forEach(b=>{
    const door = buildingDoorZone(b);
    if(pointInRect(player.pos.x, player.pos.y, door)){
      enterBuilding(b.action);
    }
  });
}
let lastEnter = 0;
function enterBuilding(action){
  const now = Date.now();
  if(now-lastEnter < 800) return;
  lastEnter = now;
  if(action==="guild") openGuild();
  if(action==="shop") openShop();
  if(action==="merchant") openMerchant();
  if(action==="dungeon_select") openDungeonSelect();
  if(action==="inn") openInn();
  if(action==="bank") openBank();
  if(action==="blacksmith") openBlacksmith();
  if(action==="market") openMarket();
  if(action==="questboard") openQuestBoard();
}
function goToLobby(){
  player.currentFloor = 0;
  player.pos = {x:400,y:300};
  showScreen("screen-overworld");
  renderOverworld();
  persist();
}

/* ============================== DUNGEON (2D, banyak lantai per dungeon) ============================== */
let dungeonMonsters = [];
function enterDungeon(dungeonId, subFloor){
  subFloor = subFloor || 1;
  player.currentFloor = dungeonId;
  player.currentSubFloor = subFloor;
  player.pos = {x:60,y:300};
  player.dungeonSubProgress[dungeonId] = Math.max(player.dungeonSubProgress[dungeonId]||1, subFloor);
  const d = DUNGEONS.find(x=>x.id===dungeonId);
  const totalFloors = dungeonFloors(dungeonId);
  const isLastFloor = subFloor>=totalFloors;
  dungeonMonsters = [];
  if(d.finalBoss || isLastFloor){
    dungeonMonsters.push({ x:600, y:200, alive:true, isBoss:true, uid:"boss", spriteKey: pickMonsterSprite(dungeonId,true) });
  } else {
    const key = dungeonId+"_"+subFloor;
    const killed = player.floorProgress[key]||0;
    const need = monstersPerSubfloor(dungeonId);
    const remain = Math.max(0, need-killed);
    for(let i=0;i<Math.min(remain,8);i++){
      dungeonMonsters.push({ x:150+Math.random()*450, y:80+Math.random()*300, alive:true, isBoss:false, uid:"m"+i, spriteKey: pickMonsterSprite(dungeonId,false) });
    }
    if(remain<=0){
      dungeonMonsters.push({ x:640, y:220, alive:true, isStairs:true, uid:"stairs" });
    }
  }
  showScreen("screen-dungeon");
  renderDungeon();
}
function removeCurrentMonsterSprite(monster){
  const idx = dungeonMonsters.findIndex(m=>m.alive && !m.isStairs && (m.isBoss===monster.isBoss));
  if(idx>=0) dungeonMonsters[idx].alive = false;
}
let dungeonLoop = null;
function renderDungeon(){
  document.getElementById("hud-coins-d").textContent = formatCoin(player.coins);
  document.getElementById("hud-hp-d").textContent = `${player.hp}/${player.maxHp}`;
  const lvlEl = document.getElementById("hud-level-d"); if(lvlEl) lvlEl.textContent = `Lv.${player.level}`;
  const d = DUNGEONS.find(x=>x.id===player.currentFloor);
  const totalFloors = dungeonFloors(d.id);
  document.getElementById("dungeon-title").textContent = `${d.name} — Lantai ${player.currentSubFloor}/${totalFloors}`;
  const canvas = document.getElementById("dungeon-canvas");
  if(dungeonLoop) cancelAnimationFrame(dungeonLoop);
  function loop(){
    if(document.getElementById("screen-dungeon").style.display==="none") return;
    const spd = 3.2;
    if(keysHeld.left) player.pos.x -= spd;
    if(keysHeld.right) player.pos.x += spd;
    if(keysHeld.up) player.pos.y -= spd;
    if(keysHeld.down) player.pos.y += spd;
    player.pos.x = Math.max(15, Math.min(canvas.width-15, player.pos.x));
    player.pos.y = Math.max(15, Math.min(canvas.height-15, player.pos.y));
    player.isMoving = updateFacingFromKeys(keysHeld);
    drawDungeon(canvas, d);
    dungeonLoop = requestAnimationFrame(loop);
  }
  loop();
}
function drawDungeon(canvas, d){
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#161018"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#4a3a55";
  ctx.strokeRect(0,0,canvas.width,canvas.height);
  ctx.font="30px serif"; ctx.textAlign="center";
  ctx.fillText("🚪", 25, 300);
  ctx.font="11px sans-serif"; ctx.fillStyle="#cbb";
  ctx.fillText(player.currentSubFloor>1?"Ke Lantai "+(player.currentSubFloor-1): (d.id===1?"Ke Lobby":"Ke Dungeon Sebelumnya"), 25, 320);

  dungeonMonsters.filter(m=>m.alive).forEach(m=>{
    if(m.isStairs){
      ctx.font="34px serif"; ctx.textAlign="center"; ctx.fillText("⬆️", m.x, m.y);
      ctx.font="11px sans-serif"; ctx.fillStyle="#bfffcf"; ctx.fillText("Lantai Berikutnya", m.x, m.y+16);
      return;
    }
    const size = m.isBoss ? 56 : 40;
    drawMonsterSprite(ctx, m.spriteKey, m.x, m.y, size, true);
    if(m.isBoss){ ctx.font="12px sans-serif"; ctx.fillStyle="#ffb3b3"; ctx.textAlign="center"; ctx.fillText("BOSS", m.x, m.y+14); }
  });
  drawPlayerSprite(ctx, player.pos.x, player.pos.y, player.facing, player.isMoving);

  if(player.pos.x<45 && Math.abs(player.pos.y-300)<40){
    exitDungeonOneLevel();
    return;
  }
  dungeonMonsters.filter(m=>m.alive).forEach(m=>{
    const dx=player.pos.x-m.x, dy=player.pos.y-m.y;
    if(Math.sqrt(dx*dx+dy*dy) < 30){
      if(m.isStairs){
        enterDungeon(player.currentFloor, player.currentSubFloor+1);
        return;
      }
      const monster = makeMonster(player.currentFloor, player.currentSubFloor, m.isBoss, m.spriteKey);
      startBattle(monster);
    }
  });
}
let lastExit=0;
function exitDungeonOneLevel(){
  const now=Date.now(); if(now-lastExit<800) return; lastExit=now;
  if(player.currentSubFloor>1){
    enterDungeon(player.currentFloor, player.currentSubFloor-1);
  } else if(player.currentFloor<=1){
    goToLobby();
  } else {
    const prevD = player.currentFloor-1;
    enterDungeon(prevD, dungeonFloors(prevD));
  }
}
function openDungeonSelect(){
  const list = document.getElementById("dungeon-select-list");
  list.innerHTML = "";
  DUNGEONS.forEach(d=>{
    const unlocked = d.id===1 || player.dungeonCleared[d.id-1];
    const totalFloors = dungeonFloors(d.id);
    const resumeFloor = player.dungeonSubProgress[d.id]||1;
    const div = document.createElement("div");
    div.className = "list-item"+(unlocked?"":" locked");
    div.innerHTML = `<span><b>Dungeon ${d.id}: ${d.name}</b><br><small>${d.finalBoss? "Bos Terakhir: "+d.boss : (totalFloors+" lantai • Bos: "+d.boss)}${unlocked?` • Lanjut dari lantai ${Math.min(resumeFloor,totalFloors)}`:""}</small></span>`;
    if(unlocked) div.onclick = ()=>{ closeAllModals(); enterDungeon(d.id, Math.min(resumeFloor,totalFloors)); };
    list.appendChild(div);
  });
  document.getElementById("modal-dungeon-select").style.display="flex";
}

/* ============================== GUILD (Jual Kristal) ============================== */
function openGuild(){
  renderGuild();
  document.getElementById("modal-guild").style.display="flex";
}
function renderGuild(){
  document.getElementById("guild-coins").textContent = formatCoin(player.coins);
  const list = document.getElementById("guild-crystal-list");
  list.innerHTML = "";
  CRYSTAL_TYPES.forEach(c=>{
    const qty = player.crystals[c.key]||0;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<span>${c.icon} ${c.name} x${qty} <small>(nilai ${c.sellRate}C/pcs)</small></span>
      <button ${qty<=0?"disabled":""} onclick="sellCrystal('${c.key}')">Jual Semua</button>`;
    list.appendChild(div);
  });
}
function sellCrystal(key){
  const c = CRYSTAL_TYPES.find(x=>x.key===key);
  const qty = player.crystals[key]||0;
  if(qty<=0) return;
  player.coins += qty*c.sellRate;
  player.crystals[key] = 0;
  persist();
  renderGuild();
}

/* ============================== SHOP (Senjata/Armor/Amulet) ============================== */
let shopTab = "weapon";
function openShop(){
  shopTab="weapon";
  renderShop();
  document.getElementById("modal-shop").style.display="flex";
}
function setShopTab(tab){ shopTab=tab; renderShop(); }
function itemExtraLabel(item){
  const extra = [];
  if(item.crit) extra.push(`Crit +${item.crit}%`);
  if(item.bonusHp) extra.push(`HP +${item.bonusHp}`);
  if(item.bonusDef) extra.push(`DEF +${item.bonusDef}`);
  if(item.bonusAtk) extra.push(`ATK +${item.bonusAtk}`);
  return extra.length ? ` <small style="color:var(--accent2)">[${extra.join(', ')}]</small>` : "";
}
function renderShop(){
  document.getElementById("shop-coins").textContent = formatCoin(player.coins);
  document.querySelectorAll("#modal-shop .tabs button").forEach(btn=>btn.classList.remove("active"));
  const tabIdx = shopTab==="weapon"?0:shopTab==="armor"?1:2;
  const tabBtns = document.querySelectorAll("#modal-shop .tabs button");
  if(tabBtns[tabIdx]) tabBtns[tabIdx].classList.add("active");
  const list = document.getElementById("shop-list");
  list.innerHTML = "";
  let items = shopTab==="weapon"?WEAPONS: shopTab==="armor"?ARMORS: AMULETS;
  items.filter(i=>!i.starter).forEach(item=>{
    const owned = shopTab==="amulet" ? player.inventory.amulets.includes(item.id)
      : shopTab==="weapon" ? player.inventory.weapons.includes(item.id)
      : player.inventory.armors.includes(item.id);
    const stat = item.cat==="armor" ? `DEF +${item.def}` : `ATK +${item.atk}`;
    const priceLabel = item.crystalReq ? `${item.price}C + ${item.crystalCost}x ${CRYSTAL_TYPES.find(c=>c.key===item.crystalReq).name}` : `${item.price}C`;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<span>${item.icon} ${item.name} <small>(${stat})</small>${itemExtraLabel(item)}<br><small>Harga: ${priceLabel}</small></span>
      <button ${owned?"disabled":""} onclick="buyItem('${item.cat}','${item.id}')">${owned?"Dimiliki":"Beli"}</button>`;
    list.appendChild(div);
  });
}
function buyItem(cat, id){
  const item = cat==="weapon"?getWeapon(id): cat==="armor"?getArmor(id): getAmulet(id);
  if(!item) return;
  if(player.coins < item.price){ alert("Coin tidak cukup!"); return; }
  if(item.crystalReq && (player.crystals[item.crystalReq]||0) < item.crystalCost){ alert("Kristal tidak cukup!"); return; }
  player.coins -= item.price;
  if(item.crystalReq) player.crystals[item.crystalReq] -= item.crystalCost;
  if(cat==="weapon") player.inventory.weapons.push(id);
  if(cat==="armor") player.inventory.armors.push(id);
  if(cat==="amulet") player.inventory.amulets.push(id);
  persist();
  renderShop();
}

/* ============================== MERCHANT (Potion) ============================== */
function openMerchant(){
  renderMerchant();
  document.getElementById("modal-merchant").style.display="flex";
}
function renderMerchant(){
  document.getElementById("merchant-coins").textContent = formatCoin(player.coins);
  const list = document.getElementById("merchant-list");
  list.innerHTML = "";
  POTIONS.forEach(p=>{
    const owned = player.inventory.potions[p.id]||0;
    const div = document.createElement("div");
    div.className="list-item";
    div.innerHTML = `<span>${p.icon} ${p.name} x${owned} <br><small>Harga: ${p.price}C</small></span>
      <button onclick="buyPotion('${p.id}')">Beli</button>`;
    list.appendChild(div);
  });
}
function buyPotion(id){
  const p = getPotion(id);
  if(player.coins < p.price){ alert("Coin tidak cukup!"); return; }
  player.coins -= p.price;
  player.inventory.potions[id] = (player.inventory.potions[id]||0)+1;
  persist();
  renderMerchant();
}

/* ============================== PENGINAPAN (INN) ============================== */
function openInn(){
  document.getElementById("inn-hp").textContent = `${player.hp}/${player.maxHp}`;
  document.getElementById("modal-inn").style.display="flex";
}
function restAtInn(){
  player.hp = player.maxHp;
  persist();
  document.getElementById("inn-hp").textContent = `${player.hp}/${player.maxHp}`;
}

/* ============================== BANK ============================== */
function openBank(){
  const c = coinToDisplay(player.coins);
  document.getElementById("bank-content").innerHTML = `
    <div class="list-item"><span>🌟 Platinum</span><b>${c.platinum}</b></div>
    <div class="list-item"><span>🟡 Gold</span><b>${c.gold}</b></div>
    <div class="list-item"><span>⚪ Perak</span><b>${c.perak}</b></div>
    <div class="list-item"><span>🟤 Perunggu</span><b>${c.perunggu}</b></div>
    <p style="font-size:0.75em;color:var(--muted);margin-top:8px;">Total: ${formatCoin(player.coins)} (1 Platinum = 100 Gold = 10.000 Perak = 1.000.000 Perunggu)</p>
  `;
  document.getElementById("modal-bank").style.display="flex";
}

/* ============================== TUKANG BESI (UPGRADE) ============================== */
const MAX_UPGRADE_LEVEL = 10;
function upgradeCost(level){ return (level+1)*350; }
function openBlacksmith(){
  document.getElementById("blacksmith-coins").textContent = formatCoin(player.coins);
  const w = getWeapon(player.equipped.weapon);
  const a = getArmor(player.equipped.armor);
  let html = "";
  if(w){
    const lvl = getUpgradeLevel(w.id);
    const maxed = lvl>=MAX_UPGRADE_LEVEL;
    const cost = upgradeCost(lvl);
    html += `<div class="list-item"><span>${w.icon} ${w.name} (+${lvl*4} ATK dari upgrade, Lv.${lvl}/${MAX_UPGRADE_LEVEL})</span>
      <button ${maxed||player.coins<cost?"disabled":""} onclick="upgradeItem('${w.id}')">${maxed?"MAX":`Upgrade (${cost}C)`}</button></div>`;
  } else {
    html += `<small>Tidak ada senjata terpasang.</small>`;
  }
  if(a){
    const lvl = getUpgradeLevel(a.id);
    const maxed = lvl>=MAX_UPGRADE_LEVEL;
    const cost = upgradeCost(lvl);
    html += `<div class="list-item"><span>${a.icon} ${a.name} (+${lvl*3} DEF dari upgrade, Lv.${lvl}/${MAX_UPGRADE_LEVEL})</span>
      <button ${maxed||player.coins<cost?"disabled":""} onclick="upgradeItem('${a.id}')">${maxed?"MAX":`Upgrade (${cost}C)`}</button></div>`;
  } else {
    html += `<small>Tidak ada armor terpasang.</small>`;
  }
  document.getElementById("blacksmith-content").innerHTML = html;
  document.getElementById("modal-blacksmith").style.display="flex";
}
function upgradeItem(itemId){
  const lvl = getUpgradeLevel(itemId);
  if(lvl>=MAX_UPGRADE_LEVEL) return;
  const cost = upgradeCost(lvl);
  if(player.coins < cost){ alert("Coin tidak cukup!"); return; }
  player.coins -= cost;
  player.upgradeLevels[itemId] = lvl+1;
  persist();
  openBlacksmith();
}

/* ============================== PASAR (JUAL GEAR) ============================== */
function openMarket(){
  document.getElementById("market-coins").textContent = formatCoin(player.coins);
  let html = "<h3>⚔️ Senjata</h3>";
  player.inventory.weapons.filter(id=>!getWeapon(id).starter).forEach(id=>{
    const w = getWeapon(id);
    const eq = player.equipped.weapon===id;
    html += `<div class="list-item"><span>${w.icon} ${w.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('weapon','${id}')">Jual (${Math.round(w.price*0.4)}C)</button></div>`;
  });
  html += "<h3>🛡️ Armor</h3>";
  if(player.inventory.armors.length===0) html += "<small>Tidak ada.</small>";
  player.inventory.armors.forEach(id=>{
    const a = getArmor(id);
    const eq = player.equipped.armor===id;
    html += `<div class="list-item"><span>${a.icon} ${a.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('armor','${id}')">Jual (${Math.round(a.price*0.4)}C)</button></div>`;
  });
  html += "<h3>💫 Amulet</h3>";
  if(player.inventory.amulets.length===0) html += "<small>Tidak ada.</small>";
  player.inventory.amulets.forEach(id=>{
    const am = getAmulet(id);
    const eq = player.equipped.amulet===id;
    html += `<div class="list-item"><span>${am.icon} ${am.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('amulet','${id}')">Jual (${Math.round(am.price*0.4)}C)</button></div>`;
  });
  document.getElementById("market-content").innerHTML = html;
  document.getElementById("modal-market").style.display="flex";
}
function sellItem(cat, id){
  const item = cat==="weapon"?getWeapon(id): cat==="armor"?getArmor(id): getAmulet(id);
  if(!item) return;
  const refund = Math.round(item.price*0.4);
  player.coins += refund;
  const list = cat==="weapon"?player.inventory.weapons: cat==="armor"?player.inventory.armors: player.inventory.amulets;
  const idx = list.indexOf(id);
  if(idx>=0) list.splice(idx,1);
  if(player.equipped[cat]===id) player.equipped[cat] = cat==="weapon" ? "w_Pedang_kayu" : null;
  delete player.upgradeLevels[id];
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp=player.maxHp;
  persist();
  openMarket();
}

/* ============================== PAPAN MISI (QUEST) ============================== */
const QUEST_LIST = [
  {id:"q1", desc:"Setor 5x Kristal Biasa 🔹", key:"biasa", qty:5, reward:1000},
  {id:"q2", desc:"Setor 3x Kristal Langka 🔷", key:"langka", qty:3, reward:5000},
  {id:"q3", desc:"Setor 2x Kristal Epik 💎", key:"epik", qty:2, reward:20000},
  {id:"q4", desc:"Setor 1x Kristal Mistis 🟣", key:"mistis", qty:1, reward:70000},
  {id:"q5", desc:"Setor 1x Kristal Legendaris 🌟", key:"legendaris", qty:1, reward:300000},
];
function openQuestBoard(){
  let html = "";
  QUEST_LIST.forEach(q=>{
    const have = player.crystals[q.key]||0;
    const ready = have>=q.qty;
    html += `<div class="list-item"><span>${q.desc}<br><small>Punya: ${have}/${q.qty} • Hadiah: ${q.reward}C</small></span>
      <button ${ready?"":"disabled"} onclick="claimQuest('${q.id}')">Klaim</button></div>`;
  });
  document.getElementById("quest-content").innerHTML = html;
  document.getElementById("modal-quest").style.display="flex";
}
function claimQuest(id){
  const q = QUEST_LIST.find(x=>x.id===id);
  if(!q) return;
  if((player.crystals[q.key]||0) < q.qty) return;
  player.crystals[q.key] -= q.qty;
  player.coins += q.reward;
  persist();
  openQuestBoard();
}

/* ============================== EQUIP & INVENTORY MODAL ============================== */
function openInventory(){
  renderInventory();
  document.getElementById("modal-inventory").style.display="flex";
}
function renderInventory(){
  const wrap = document.getElementById("inv-content");
  let html = `<div class="list-item"><span>🧙 Level ${player.level} <small>(XP ${player.xp}/${xpForLevel(player.level)})</small></span><b>🔹${player.skillPoints} Poin Skill</b></div>`;
  html += `<div class="list-item"><span>⚔️ ATK ${playerTotalAtk()} • 🛡️ DEF ${playerTotalDef()} • 🎯 Crit ${playerTotalCrit()}%</span><button onclick="closeAllModals();openSkillTree();">🌳 Pohon Skill</button></div>`;
  html += `<h3>⚔️ Senjata</h3>`;
  player.inventory.weapons.forEach(id=>{
    const w = getWeapon(id);
    const eq = player.equipped.weapon===id;
    const lvl = getUpgradeLevel(id);
    html += `<div class="list-item"><span>${w.icon} ${w.name} (ATK+${w.atk}${lvl>0?`, +${lvl*4} upgrade`:""})${itemExtraLabel(w)}</span><button ${eq?"disabled":""} onclick="equipItem('weapon','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>🛡️ Armor</h3>`;
  if(player.inventory.armors.length===0) html += `<small>Belum punya armor.</small>`;
  player.inventory.armors.forEach(id=>{
    const a = getArmor(id);
    const eq = player.equipped.armor===id;
    const lvl = getUpgradeLevel(id);
    html += `<div class="list-item"><span>${a.icon} ${a.name} (DEF+${a.def}${lvl>0?`, +${lvl*3} upgrade`:""})${itemExtraLabel(a)}</span><button ${eq?"disabled":""} onclick="equipItem('armor','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>💫 Amulet</h3>`;
  if(player.inventory.amulets.length===0) html += `<small>Belum punya amulet.</small>`;
  player.inventory.amulets.forEach(id=>{
    const a = getAmulet(id);
    const eq = player.equipped.amulet===id;
    html += `<div class="list-item"><span>${a.icon} ${a.name} (ATK+${a.atk}/DEF+${a.def})${itemExtraLabel(a)}</span><button ${eq?"disabled":""} onclick="equipItem('amulet','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>📜 Skill Dipelajari (${player.skills.length})</h3>`;
  if(player.skills.length===0) html += `<small>Belum ada skill. Buka Pohon Skill untuk mempelajarinya.</small>`;
  player.skills.forEach(sid=>{
    const s = getSkill(sid);
    if(!s) return;
    html += `<div class="list-item"><span>${s.name}</span><small>${s.desc}</small></div>`;
  });
  wrap.innerHTML = html;
}
function equipItem(cat, id){
  player.equipped[cat] = id;
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp=player.maxHp;
  persist();
  renderInventory();
}

/* ============================== POHON SKILL ============================== */
function openSkillTree(){
  renderSkillTree();
  document.getElementById("modal-skilltree").style.display="flex";
}
function renderSkillTree(){
  document.getElementById("skilltree-points").textContent = player.skillPoints;
  const branches = skillTreeBranches();
  let html = "";
  Object.keys(branches).forEach(bkey=>{
    const chain = branches[bkey];
    const label = bkey.startsWith("el_") ? `✨ Elemen ${bkey.slice(3)}` : `⚔️ Mastery ${bkey.slice(3)}`;
    html += `<h3>${label}</h3>`;
    chain.forEach(s=>{
      const learned = player.skills.includes(s.id);
      const can = canLearnTreeSkill(s);
      let status = learned ? "Dipelajari" : can ? `Pelajari (${s.cost} Poin)` : "Terkunci";
      html += `<div class="list-item"><span>${s.name}<br><small>${s.desc||''}</small></span>
        <button ${(!can)?"disabled":""} onclick="learnTreeSkill('${s.id}')">${status}</button></div>`;
    });
  });
  document.getElementById("skilltree-content").innerHTML = html;
}

/* ============================== MODAL HELPERS ============================== */
function closeAllModals(){
  document.querySelectorAll(".modal").forEach(m=>m.style.display="none");
}
function openSkillMenu(){
  const list = document.getElementById("skill-menu-list");
  const atkSkills = player.skills.map(getSkill).filter(s=>s && s.type==="attack");
  if(atkSkills.length===0){ list.innerHTML = "<small>Belum ada skill serangan.</small>"; }
  else {
    list.innerHTML = atkSkills.map(s=>{
      const cd = battle.skillCooldowns[s.id]||0;
      return `<div class="list-item"><span>${s.name}${cd>0?` (CD:${cd})`:""}</span><button ${cd>0?"disabled":""} onclick="playerUseSkill('${s.id}')">Pakai</button></div>`;
    }).join("");
  }
  document.getElementById("modal-skill-menu").style.display="flex";
}
function closeSkillMenu(){ document.getElementById("modal-skill-menu").style.display="none"; }
function openItemMenu(){
  const list = document.getElementById("item-menu-list");
  const owned = Object.entries(player.inventory.potions).filter(([id,q])=>q>0);
  if(owned.length===0){ list.innerHTML = "<small>Tidak ada item.</small>"; }
  else {
    list.innerHTML = owned.map(([id,q])=>{
      const p = getPotion(id);
      return `<div class="list-item"><span>${p.icon} ${p.name} x${q}</span><button onclick="playerUseItem('${id}')">Pakai</button></div>`;
    }).join("");
  }
  document.getElementById("modal-item-menu").style.display="flex";
}
function closeItemMenu(){ document.getElementById("modal-item-menu").style.display="none"; }

/* ============================== RENDER BATTLE UI ============================== */
function renderBattle(){
  const m = battle.monster;
  document.getElementById("enemy-name").textContent = `${m.name}${m.isBoss?" 👑 (BOSS)":""}`;
  document.getElementById("enemy-hp-bar").style.width = Math.max(0,(m.hp/m.maxHp*100))+"%";
  document.getElementById("enemy-hp-text").textContent = `${Math.max(0,m.hp)}/${m.maxHp}`;
  document.getElementById("player-hp-bar").style.width = Math.max(0,(player.hp/player.maxHp*100))+"%";
  document.getElementById("player-hp-text").textContent = `${Math.max(0,player.hp)}/${player.maxHp}`;
  const logEl = document.getElementById("battle-log");
  logEl.innerHTML = battle.log.map(l=>`<div>${l}</div>`).join("");
}

/* ============================== LOGIN / REGISTER UI ============================== */
function doLogin(){
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const r = loginAccount(u,p);
  const msg = document.getElementById("login-msg");
  if(!r.ok){ msg.textContent = r.msg; return; }
  msg.textContent = "";
  enterGame();
}
function doRegister(){
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const e = document.getElementById("login-email").value.trim();
  const r = registerAccount(u,p,e);
  const msg = document.getElementById("login-msg");
  if(!r.ok){ msg.textContent = r.msg; return; }
  msg.textContent = "Akun dibuat! Silakan login.";
}
function enterGame(){
  showScreen("screen-overworld");
  renderOverworld();
}

/* ============================== LAYAR PENUH & LANDSCAPE ============================== */
function goFullscreen(){
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  const doLock = ()=>{
    if(screen.orientation && screen.orientation.lock){
      screen.orientation.lock("landscape").catch(()=>{});
    }
  };
  if(req){
    req.call(el).then(doLock).catch(()=>{ doLock(); });
  } else {
    doLock();
  }
}

/* ============================== INIT ============================== */
function initGame(){
  initKeyboard();
  bindJoystick("owjoy", keysHeld);
  bindJoystick("dgjoy", keysHeld);
  bindJoystick("joyd", { get left(){return dodgeGame?dodgeGame.keys.left:false;}, set left(v){if(dodgeGame)dodgeGame.keys.left=v;},
    get right(){return dodgeGame?dodgeGame.keys.right:false;}, set right(v){if(dodgeGame)dodgeGame.keys.right=v;},
    get up(){return dodgeGame?dodgeGame.keys.up:false;}, set up(v){if(dodgeGame)dodgeGame.keys.up=v;},
    get down(){return dodgeGame?dodgeGame.keys.down:false;}, set down(v){if(dodgeGame)dodgeGame.keys.down=v;} });
  showScreen("screen-login");
}
window.addEventListener("DOMContentLoaded", initGame);
