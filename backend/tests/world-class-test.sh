#!/bin/bash
# World-Class VintageVision Test Suite
# Tests all domain experts and features

API_URL="http://localhost:3000/api/analyze"
RESULTS_DIR="/tmp/vintagevision-tests"
mkdir -p $RESULTS_DIR

echo "════════════════════════════════════════════════════════════════"
echo "🧪 VINTAGEVISION WORLD-CLASS TEST SUITE"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Function to test with an image URL
test_image() {
    local name="$1"
    local url="$2"
    local asking_price="$3"
    local expected_domain="$4"

    echo "────────────────────────────────────────────────────────────────"
    echo "📸 Testing: $name"
    echo "   URL: $url"
    echo "   Expected Domain: $expected_domain"
    if [ -n "$asking_price" ]; then
        echo "   Asking Price: \$$asking_price"
    fi
    echo ""

    # Download image
    local img_file="$RESULTS_DIR/${name// /_}.jpg"
    curl -sL "$url" -o "$img_file" 2>/dev/null

    if [ ! -f "$img_file" ] || [ ! -s "$img_file" ]; then
        echo "   ❌ Failed to download image"
        return 1
    fi

    # Convert to base64
    local base64_data=$(base64 -w 0 "$img_file")
    local data_url="data:image/jpeg;base64,$base64_data"

    # Build JSON payload
    local json_payload
    if [ -n "$asking_price" ]; then
        json_payload=$(jq -n --arg img "$data_url" --argjson price "$asking_price" '{image: $img, askingPrice: $price}')
    else
        json_payload=$(jq -n --arg img "$data_url" '{image: $img}')
    fi

    # Make API request
    local start_time=$(date +%s%3N)
    local response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        --max-time 120)
    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))

    # Save response
    echo "$response" > "$RESULTS_DIR/${name// /_}_response.json"

    # Parse response
    local success=$(echo "$response" | jq -r '.success // false')

    if [ "$success" = "true" ]; then
        local item_name=$(echo "$response" | jq -r '.data.name // "Unknown"')
        local domain=$(echo "$response" | jq -r '.data.domainExpert // "Unknown"')
        local category=$(echo "$response" | jq -r '.data.productCategory // "Unknown"')
        local confidence=$(echo "$response" | jq -r '.data.confidence // 0')
        local maker=$(echo "$response" | jq -r '.data.maker // "null"')
        local value_min=$(echo "$response" | jq -r '.data.estimatedValueMin // "null"')
        local value_max=$(echo "$response" | jq -r '.data.estimatedValueMax // "null"')
        local deal_rating=$(echo "$response" | jq -r '.data.dealRating // "null"')
        local flip=$(echo "$response" | jq -r '.data.flipDifficulty // "null"')
        local evidence_for=$(echo "$response" | jq -r '.data.evidenceFor | length // 0')
        local verification=$(echo "$response" | jq -r '.data.verificationTips | length // 0')

        echo "   ✅ SUCCESS (${duration}ms)"
        echo "   📦 Identified: $item_name"
        echo "   🎯 Domain: $domain (expected: $expected_domain)"
        echo "   📊 Category: $category"
        echo "   🎲 Confidence: $confidence"

        if [ "$maker" != "null" ]; then
            echo "   🏭 Maker: $maker"
        fi

        if [ "$value_min" != "null" ] && [ "$value_max" != "null" ]; then
            echo "   💰 Value: \$$value_min - \$$value_max"
        fi

        if [ "$deal_rating" != "null" ]; then
            echo "   🏷️ Deal Rating: $deal_rating"
        fi

        if [ "$flip" != "null" ]; then
            echo "   📈 Flip Difficulty: $flip"
        fi

        echo "   📋 Evidence points: $evidence_for"
        echo "   ✓ Verification tips: $verification"

        # Check if domain matches expected
        if [ "$domain" = "$expected_domain" ]; then
            echo "   ✅ Domain CORRECT"
        else
            echo "   ⚠️ Domain MISMATCH (got $domain, expected $expected_domain)"
        fi
    else
        local error=$(echo "$response" | jq -r '.error // "Unknown error"')
        echo "   ❌ FAILED: $error"
        return 1
    fi

    echo ""
    return 0
}

# Test counter
PASS=0
FAIL=0

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "PHASE 1: DOMAIN EXPERT TESTS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Test 1: FURNITURE - Stickley Chair (Wikimedia Commons)
if test_image "Stickley Mission Chair" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Stickley_armchair.jpg/440px-Stickley_armchair.jpg" \
    "" "furniture"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 2: CERAMICS - Rookwood Pottery
if test_image "Rookwood Pottery Vase" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Rookwood_Pottery_Company_-_Vase_-_1900.jpg/440px-Rookwood_Pottery_Company_-_Vase_-_1900.jpg" \
    "" "ceramics"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 3: GLASS - Tiffany Style Lamp
if test_image "Tiffany Style Lamp" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/WLA_brooklynmuseum_Louis_Comfort_Tiffany_Table_Lamp.jpg/440px-WLA_brooklynmuseum_Louis_Comfort_Tiffany_Table_Lamp.jpg" \
    "" "lighting"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 4: JEWELRY - Art Deco Brooch
if test_image "Art Deco Jewelry" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cartier_Art_Deco_Egyptian_pectoral%2C_1913.jpg/440px-Cartier_Art_Deco_Egyptian_pectoral%2C_1913.jpg" \
    "" "jewelry"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 5: WATCHES - Vintage Pocket Watch
if test_image "Vintage Pocket Watch" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Elgin_pocketwatch.jpg/440px-Elgin_pocketwatch.jpg" \
    "" "watches"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 6: ART - Oil Painting
if test_image "Oil Painting Landscape" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Thomas_Cole_-_The_Oxbow.jpg/800px-Thomas_Cole_-_The_Oxbow.jpg" \
    "" "art"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 7: SILVER - Sterling Tea Service
if test_image "Sterling Silver Teapot" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Paul_Revere_Jr._-_Sons_of_Liberty_Bowl_-_MFA_Boston_1949.45.jpg/800px-Paul_Revere_Jr._-_Sons_of_Liberty_Bowl_-_MFA_Boston_1949.45.jpg" \
    "" "silver"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 8: TEXTILES - Oriental Rug
if test_image "Persian Rug" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Ardabil_Carpet.jpg/440px-Ardabil_Carpet.jpg" \
    "" "textiles"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 9: BOOKS - Antique Book
if test_image "Antique Book" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/First_Folio.jpg/440px-First_Folio.jpg" \
    "" "books"; then
    ((PASS++))
else
    ((FAIL++))
fi

# Test 10: TOYS - Vintage Toy
if test_image "Cast Iron Toy Bank" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mechanical_bank_1890s.jpg/440px-Mechanical_bank_1890s.jpg" \
    "" "toys"; then
    ((PASS++))
else
    ((FAIL++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "PHASE 2: DEAL ANALYSIS TESTS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Test with asking price - should be exceptional deal
if test_image "Deal Test - Underpriced Chair" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Stickley_armchair.jpg/440px-Stickley_armchair.jpg" \
    5000 "furniture"; then  # $50 in cents
    ((PASS++))
else
    ((FAIL++))
fi

# Test with high asking price - should be overpriced
if test_image "Deal Test - Overpriced Item" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Rookwood_Pottery_Company_-_Vase_-_1900.jpg/440px-Rookwood_Pottery_Company_-_Vase_-_1900.jpg" \
    100000000 "ceramics"; then  # $1,000,000 in cents
    ((PASS++))
else
    ((FAIL++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📊 TEST RESULTS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "   ✅ Passed: $PASS"
echo "   ❌ Failed: $FAIL"
echo "   📁 Results saved to: $RESULTS_DIR"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo "⚠️ Some tests failed. Check the results directory for details."
    exit 1
fi
