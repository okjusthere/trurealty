#!/bin/bash
BASE=http://localhost:3000/api

echo "🌱 Creating admin user..."
curl -s -X POST "$BASE/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trurealtycorp.com","password":"admin123","name":"Admin"}' | head -c 100
echo ""

echo "🔑 Logging in..."
TOKEN=$(curl -s -X POST "$BASE/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trurealtycorp.com","password":"admin123"}' | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi
echo "✅ Logged in"

AUTH="Authorization: JWT $TOKEN"

echo ""
echo "👤 Creating agents..."

create_agent() {
  local data="$1"
  local name=$(echo "$data" | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])")
  local result=$(curl -s -X POST "$BASE/agents" -H "Content-Type: application/json" -H "$AUTH" -d "$data")
  local id=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('doc',{}).get('id','') or d.get('id',''))" 2>/dev/null)
  echo "  ✅ $name (id: $id)"
  echo "$id"
}

RIVA_ID=$(create_agent '{"name":"Riva Zheng","title":"broker","phone":"929-806-0505","email":"riva.zheng@trurealtycorp.com","specialties":["residential","new-development","luxury"],"serviceAreas":["queens","brooklyn","manhattan","nassau"],"languages":["english","mandarin"],"slug":"riva-zheng","sortOrder":1,"featured":true,"status":"active"}')
RIVA_ID=$(echo "$RIVA_ID" | tail -1)

LING_ID=$(create_agent '{"name":"Ling Xiang","title":"realtor","phone":"347-925-7557","email":"ling.xiang@trurealtycorp.com","specialties":["residential","new-development"],"serviceAreas":["queens","brooklyn"],"languages":["english","mandarin"],"slug":"ling-xiang","sortOrder":2,"featured":true,"status":"active"}')
LING_ID=$(echo "$LING_ID" | tail -1)

MIN_ID=$(create_agent '{"name":"Min Yue Dong","title":"realtor","phone":"917-285-5628","email":"minyue.dong@trurealtycorp.com","specialties":["residential","rental"],"serviceAreas":["queens","nassau","long-island"],"languages":["english","mandarin"],"slug":"min-yue-dong","sortOrder":3,"featured":true,"status":"active"}')
MIN_ID=$(echo "$MIN_ID" | tail -1)

KIEN_ID=$(create_agent '{"name":"Kien S. Chow","title":"associate-broker","credentials":"CBR, GRI","phone":"917-415-4955","email":"kien.chow@trurealtycorp.com","specialties":["residential","commercial","investment"],"serviceAreas":["queens","brooklyn","manhattan"],"languages":["english","cantonese","mandarin"],"slug":"kien-s-chow","sortOrder":4,"featured":true,"status":"active"}')
KIEN_ID=$(echo "$KIEN_ID" | tail -1)

create_agent '{"name":"Yingzhen Zhang","title":"realtor","phone":"718-888-9988","email":"yingzhen.zhang@trurealtycorp.com","specialties":["residential","new-development"],"serviceAreas":["queens","nassau"],"languages":["english","mandarin"],"slug":"yingzhen-zhang","sortOrder":5,"featured":false,"status":"active"}' > /dev/null

create_agent '{"name":"Guang Yang Li","title":"realtor","phone":"347-439-9466","email":"guangyang.li@trurealtycorp.com","specialties":["residential","rental"],"serviceAreas":["queens","nassau","long-island"],"languages":["english","mandarin"],"slug":"guang-yang-li","sortOrder":6,"featured":false,"status":"active"}' > /dev/null

echo ""
echo "🏗️  Creating new developments..."

for dev_data in \
  '{"name":"Fowler Park","location":"Brooklyn, NY","developer":"Fowler Park Development LLC","status":"move-in-ready","priceRange":{"min":550000,"max":1200000},"totalUnits":120,"amenities":["gym","rooftop","parking","concierge","laundry","pet-friendly"],"featured":true,"slug":"fowler-park","contactAgent":"'"$RIVA_ID"'"}' \
  '{"name":"Longfield","location":"Flushing, Queens","developer":"Longfield Realty Corp","status":"under-construction","priceRange":{"min":480000,"max":950000},"totalUnits":85,"amenities":["gym","parking","laundry","storage","outdoor-space"],"featured":true,"slug":"longfield","contactAgent":"'"$LING_ID"'"}' \
  '{"name":"CKZ Tower","location":"Rego Park, Queens","developer":"CKZ Development Group","status":"under-construction","priceRange":{"min":620000,"max":1500000},"totalUnits":200,"amenities":["gym","rooftop","parking","concierge","pool","doorman","ev-charging"],"featured":true,"slug":"ckz-tower","contactAgent":"'"$RIVA_ID"'"}' \
  '{"name":"East West Plaza","location":"Flushing, Queens","developer":"East West Realty","status":"move-in-ready","priceRange":{"min":380000,"max":750000},"totalUnits":60,"amenities":["parking","laundry","storage"],"featured":true,"slug":"east-west-plaza","contactAgent":"'"$MIN_ID"'"}' \
  '{"name":"Harvest Plaza","location":"Elmhurst, Queens","developer":"Harvest Development","status":"pre-construction","priceRange":{"min":450000,"max":880000},"totalUnits":95,"amenities":["gym","parking","rooftop","laundry","pet-friendly"],"featured":true,"slug":"harvest-plaza","contactAgent":"'"$KIEN_ID"'"}' \
  '{"name":"Four Points","location":"Long Island City, Queens","developer":"Four Points Development","status":"under-construction","priceRange":{"min":700000,"max":2000000},"totalUnits":150,"amenities":["gym","rooftop","parking","concierge","pool","doorman","ev-charging","outdoor-space"],"featured":true,"slug":"four-points","contactAgent":"'"$RIVA_ID"'"}'
do
  name=$(echo "$dev_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])")
  curl -s -X POST "$BASE/new-developments" -H "Content-Type: application/json" -H "$AUTH" -d "$dev_data" > /dev/null
  echo "  ✅ $name"
done

echo ""
echo "🏠 Creating listings..."

for listing_data in \
  '{"title":"Spacious 3BR Colonial in Great Neck","address":"125 Maple Drive","city":"Great Neck","state":"NY","zip":"11020","price":1250000,"beds":3,"baths":2.5,"sqft":2400,"propertyType":"house","status":"active","featured":true,"slug":"125-maple-drive-great-neck","agent":"'"$RIVA_ID"'"}' \
  '{"title":"Modern 2BR Condo in Flushing","address":"136-20 Sanford Ave","city":"Flushing","state":"NY","zip":"11355","price":680000,"beds":2,"baths":2,"sqft":1100,"propertyType":"condo","status":"active","featured":true,"slug":"136-20-sanford-ave-flushing","agent":"'"$LING_ID"'"}' \
  '{"title":"Renovated 4BR in Bayside","address":"42-15 Bell Blvd","city":"Bayside","state":"NY","zip":"11361","price":1580000,"beds":4,"baths":3,"sqft":3200,"propertyType":"house","status":"active","featured":true,"slug":"42-15-bell-blvd-bayside","agent":"'"$KIEN_ID"'"}' \
  '{"title":"Luxury 1BR at Fowler Park","address":"88 Fowler Park Way, Unit 12C","city":"Brooklyn","state":"NY","zip":"11201","price":750000,"beds":1,"baths":1,"sqft":780,"propertyType":"condo","status":"pending","featured":false,"slug":"88-fowler-park-way-unit-12c","agent":"'"$RIVA_ID"'"}' \
  '{"title":"Charming Co-op in Forest Hills","address":"108-50 Queens Blvd","city":"Forest Hills","state":"NY","zip":"11375","price":420000,"beds":2,"baths":1,"sqft":950,"propertyType":"coop","status":"sold","featured":false,"slug":"108-50-queens-blvd-forest-hills","agent":"'"$MIN_ID"'"}'
do
  title=$(echo "$listing_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
  curl -s -X POST "$BASE/listings" -H "Content-Type: application/json" -H "$AUTH" -d "$listing_data" > /dev/null
  echo "  ✅ $title"
done

echo ""
echo "⭐ Creating testimonials..."

for test_data in \
  '{"clientName":"Jennifer & Michael W.","content":"Riva and her team were absolutely amazing throughout our home buying journey. They understood exactly what we were looking for and found us the perfect home in Great Neck. Their knowledge of the local market is unmatched.","rating":5,"transactionType":"buyer","agent":"'"$RIVA_ID"'","featured":true}' \
  '{"clientName":"David Chen","content":"I sold my property in Flushing with Tru Realty and could not be happier. They got us 15% above asking price! Professional photography, staging advice, and excellent negotiation skills.","rating":5,"transactionType":"seller","agent":"'"$LING_ID"'","featured":true}' \
  '{"clientName":"Lisa & Tom K.","content":"As first-time buyers, we were nervous about the process. Min Yue was patient, knowledgeable, and always available to answer our questions. She made our dream of homeownership a reality.","rating":5,"transactionType":"buyer","agent":"'"$MIN_ID"'","featured":true}' \
  '{"clientName":"Robert Liu","content":"Kien helped us purchase an investment property in Brooklyn. His commercial real estate expertise and bilingual abilities made the complex transaction smooth. Highly recommended for serious investors.","rating":5,"transactionType":"buyer","agent":"'"$KIEN_ID"'","featured":true}' \
  '{"clientName":"Sarah Wang","content":"We bought a unit at the Longfield development through Tru Realty. They knew every detail about the project and helped us choose the best unit and negotiate a great price. The bilingual support was invaluable for our family.","rating":5,"transactionType":"buyer","agent":"'"$LING_ID"'","featured":true}'
do
  name=$(echo "$test_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['clientName'])")
  curl -s -X POST "$BASE/testimonials" -H "Content-Type: application/json" -H "$AUTH" -d "$test_data" > /dev/null
  echo "  ✅ $name"
done

echo ""
echo "📝 Creating blog posts..."

for page_data in \
  '{"title":"First-Time Home Buyer Guide for New York","pageType":"blog","excerpt":"Everything you need to know about buying your first home in New York City and Long Island, from pre-approval to closing.","publishedAt":"2026-03-15","slug":"first-time-home-buyer-guide-ny"}' \
  '{"title":"Top 5 Neighborhoods in Queens for Families","pageType":"community","excerpt":"Discover the best family-friendly neighborhoods in Queens with excellent schools, parks, and community amenities.","publishedAt":"2026-03-01","slug":"top-5-neighborhoods-queens-families"}' \
  '{"title":"Understanding NYC Co-op vs Condo: A Complete Guide","pageType":"blog","excerpt":"Learn the key differences between co-ops and condos in New York City to make an informed purchasing decision.","publishedAt":"2026-02-20","slug":"nyc-coop-vs-condo-guide"}'
do
  title=$(echo "$page_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
  curl -s -X POST "$BASE/pages" -H "Content-Type: application/json" -H "$AUTH" -d "$page_data" > /dev/null
  echo "  ✅ $title"
done

echo ""
echo "🎉 Seeding complete!"
