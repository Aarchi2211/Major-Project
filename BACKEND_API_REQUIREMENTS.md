# Backend API Requirements for Cloud Report Analysis

## Overview
The frontend now has a file upload feature that sends cloud cost reports (CSV/Excel) from AWS, Azure, or GCP to the backend for analysis. This document outlines the backend API requirements.

## API Endpoint

### Upload and Analyze Report
**Endpoint:** `POST /api/upload-report`

**Authentication:** Required (Bearer token)

**Request:**
- **Content-Type:** multipart/form-data
- **Body:**
  - `file`: File object (CSV, XLSX, or XLS format)

**Response (Success - 200):**
```json
{
  "success": true,
  "recordsProcessed": 150,
  "resources": [
    {
      "id": 1,
      "name": "EC2-Instance-01",
      "type": "Compute",
      "cpu": 65,
      "storage": 250,
      "bandwidth": 1250,
      "cost": "$450.50",
      "status": "Active",
      "region": "us-east-1"
    }
    // ... more resources
  ],
  "analysis": {
    "unusedResources": [],
    "highCostServices": [],
    "costSpikes": [],
    "recommendations": []
  }
}
```

**Response (Error - 4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## File Format Support

### CSV Format (Example)
```
ResourceName,Type,Provider,Region,CPU%,Storage(GB),Bandwidth(MB),MonthlyCost,Status
EC2-Instance-01,Compute,AWS,us-east-1,65,250,1250,450.50,Active
RDS-Database,Database,AWS,us-east-1,32,500,850,320.75,Active
S3-Bucket-Main,Storage,AWS,us-west-2,5,1500,2100,85.30,Active
```

### Excel Format (XLSX)
Same column structure as CSV, can have multiple sheets

### AWS CUR (Cost and Usage Report) Format
- Process standard AWS CUR format
- Extract: Resource ID, Service, Region, Cost, Usage metrics

### Azure Cost Management Export
- Process Azure cost export format
- Extract: Resource Group, Service, Region, Cost, Usage details

### GCP Billing Export
- Process GCP billing CSV
- Extract: Project, Service, Region, Cost, Usage metrics

## Analysis Features to Implement

### 1. Unused Resources Detection
- Resources with 0% CPU usage for 7+ days
- Resources with no data transfer
- Mark as "Idle" status

### 2. High-Cost Services
- Identify top 5 most expensive services
- Calculate cost per unit usage ratio
- Flag services exceeding budget thresholds

### 3. Cost Spike Detection
- Compare current month vs previous month
- Flag unusual cost increases (>20%)
- Identify resource causing spike

### 4. Monthly Trend Charts Data
- Return historical monthly cost data (last 12 months if available)
- Format: `{ month: "Jan 2025", cost: 5000 }`

### 5. Leak Alerts
- Sudden cost increases
- Unused resources consuming costs
- Over-provisioned resources

## Database Storage

Store analyzed data with:
- User ID (who uploaded the report)
- Upload timestamp
- Original file name
- Analysis results
- Resources snapshot
- Recommendations

## Additional Endpoints (Future)

### Get Analysis Reports
**GET /api/analysis-reports**
- Fetch all uploaded reports for current user
- Include analysis results and timestamps

### Get Cost Trends
**GET /api/cost-trends**
- Return monthly cost data for charts
- Filter by date range, provider, service

### Get Recommendations
**GET /api/recommendations**
- Return list of cost optimization recommendations
- Include savings potential

### Export Report
**GET /api/export-report/:reportId**
- Export analysis as PDF/CSV
- Include graphs and recommendations

## Implementation Notes

1. **File Processing:**
   - Validate file format before processing
   - Handle large files efficiently (streaming for large CSVs)
   - Support multiple CSV parsers for different cloud providers

2. **Data Normalization:**
   - Map different column names from various providers to standard format
   - Handle different cost formats (USD, EUR, etc.)

3. **Analysis Logic:**
   - Implement heuristics for detecting unused resources
   - Use statistical methods for cost spike detection
   - Store recommendations in database

4. **Error Handling:**
   - Validate CSV structure
   - Handle missing columns gracefully
   - Return meaningful error messages

5. **Performance:**
   - Process files asynchronously if large
   - Cache analysis results
   - Index resources for fast queries

## Security Considerations

- Validate file content (not just extension)
- Scan for malicious content
- Limit file size (10MB)
- Encrypt stored cost data
- Implement rate limiting on upload endpoint
- Verify user has permission to upload multiple files
