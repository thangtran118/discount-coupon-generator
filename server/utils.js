export function isPhoneNumberValid(phone) {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone);
}

export function generateDiscountCode(phone) {
    // Generate a timestamp-based string
    const timestamp = Date.now().toString();

    // Combine the timestamp and phone number
    const combinedString = timestamp + phone;

    // Convert the combined string to a hash code
    let hashCode = 0;
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        hashCode = (hashCode << 5) - hashCode + char;
        hashCode &= hashCode; // Convert to 32bit integer
    }

    // Get the absolute value of the hash code
    const absoluteHashCode = Math.abs(hashCode);

    // Take the last 4 characters of the absoluteHashCode
    const uniquePart = absoluteHashCode.toString().slice(-4);

    // Concatenate with the prefix 'BCM-'
    return 'BCM-' + uniquePart;
}