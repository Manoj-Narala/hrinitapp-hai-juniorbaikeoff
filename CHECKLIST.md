# Development & Deployment Checklist

## ✅ Initial Setup

- [ ] Node.js installed (v16+)
- [ ] npm or yarn available
- [ ] Google Gemini API key obtained
- [ ] Run `setup.bat` successfully
- [ ] Created `backend/.env` file
- [ ] Added `GEMINI_API_KEY` to `.env`

## ✅ First Run

- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:3000/api/health
- [ ] No console errors in browser

## ✅ Feature Testing

### Idea Submission
- [ ] Can fill out the idea form
- [ ] All 4 fields are required
- [ ] "Generate Analysis" button works
- [ ] AI analysis loads successfully
- [ ] Business Value score displays (1-10)
- [ ] Statement of Work shows
- [ ] Can view original idea (collapsible)

### AI Review Page
- [ ] AI analysis displays correctly
- [ ] Can go back to edit idea
- [ ] Can submit for approval
- [ ] Success message appears
- [ ] Redirects to dashboard

### Approval Dashboard
- [ ] Initiatives list loads
- [ ] Can filter by status (Pending/Approved/Rejected/All)
- [ ] Initiative cards show correctly
- [ ] Business Value score displays
- [ ] Status badges show correct color
- [ ] Can click to view details

### Initiative Detail Modal
- [ ] Modal opens when clicking initiative
- [ ] All initiative details display
- [ ] Business Value Scale Reference shows
- [ ] Can approve initiative
- [ ] ADO Work Item ID generated (simulated)
- [ ] Can reject initiative with reason
- [ ] Rejection reason is required
- [ ] Modal closes after action

## ✅ Data Persistence

- [ ] Submitted initiatives saved to JSON file
- [ ] Data persists after server restart
- [ ] Approved status saved correctly
- [ ] Rejected status saved correctly
- [ ] ADO Work Item ID saved
- [ ] Timestamps are correct

## ✅ Error Handling

- [ ] Missing API key shows error
- [ ] Invalid API key shows error
- [ ] Network errors handled gracefully
- [ ] Empty form submission prevented
- [ ] 404 routes handled
- [ ] Database errors caught

## ✅ UI/UX

- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Loading spinners show during operations
- [ ] Success messages clear and visible
- [ ] Error messages clear and helpful
- [ ] Navigation works correctly
- [ ] All buttons have hover states

## ✅ Performance

- [ ] Page loads quickly
- [ ] AI analysis returns in reasonable time
- [ ] Dashboard loads fast with many items
- [ ] No memory leaks
- [ ] No console warnings

## ✅ Code Quality

- [ ] No console.error in production
- [ ] Environment variables used correctly
- [ ] API keys not exposed to frontend
- [ ] Comments added where needed
- [ ] Code formatted consistently

## ✅ Documentation

- [ ] README.md complete
- [ ] QUICKSTART.md tested
- [ ] API_TESTING.md examples work
- [ ] ARCHITECTURE.md accurate
- [ ] All docs spell-checked

## ✅ Security

- [ ] `.env` file in `.gitignore`
- [ ] No API keys in code
- [ ] CORS configured correctly
- [ ] Input validation on backend
- [ ] No SQL injection risk (using JSON)

## ✅ Before Sharing/Deployment

- [ ] Remove sample data (optional)
- [ ] Update README with deployment info
- [ ] Test all features one more time
- [ ] Check all links in documentation
- [ ] Verify `.gitignore` is complete
- [ ] Test fresh install on new machine

## 🚀 Production Readiness (Future)

- [ ] Replace JSON DB with MongoDB/PostgreSQL
- [ ] Add user authentication (JWT)
- [ ] Implement real Azure DevOps API
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific settings
- [ ] Add logging (Winston/Pino)
- [ ] Implement rate limiting
- [ ] Add HTTPS/SSL
- [ ] Set up monitoring (Sentry/DataDog)
- [ ] Create backup strategy
- [ ] Add automated tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

## 📝 Known Limitations

- [ ] JSON file database not suitable for production
- [ ] No user authentication
- [ ] No real-time updates
- [ ] ADO integration is simulated
- [ ] Single server only
- [ ] No file uploads
- [ ] No email notifications
- [ ] No advanced analytics

## 🔄 Regular Maintenance

### Weekly
- [ ] Check for npm package updates
- [ ] Review error logs
- [ ] Test critical paths

### Monthly
- [ ] Update dependencies
- [ ] Review and archive old initiatives
- [ ] Check API key quota
- [ ] Review documentation accuracy

### Quarterly
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review

## 🐛 Troubleshooting Checklist

### Backend Won't Start
- [ ] Check Node.js version
- [ ] Verify `backend/package.json` exists
- [ ] Run `npm install` in backend folder
- [ ] Check `backend/.env` exists
- [ ] Verify port 3000 is available
- [ ] Check for syntax errors in server.js

### Frontend Won't Start
- [ ] Check Node.js version
- [ ] Verify `frontend/package.json` exists
- [ ] Run `npm install` in frontend folder
- [ ] Verify port 5173 is available
- [ ] Check for syntax errors in main.js

### AI Analysis Fails
- [ ] Verify GEMINI_API_KEY is set
- [ ] Check API key is valid
- [ ] Test API key with curl/Postman
- [ ] Check network connectivity
- [ ] Review API quota limits
- [ ] Check error logs in backend

### Data Not Saving
- [ ] Check `data/` folder exists
- [ ] Verify write permissions
- [ ] Check disk space
- [ ] Review backend logs
- [ ] Verify JSON file is not corrupted

### UI Issues
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Verify Tailwind CSS loaded
- [ ] Check Vue DevTools
- [ ] Test in different browser

## 📊 Success Metrics

After completing setup, you should be able to:

✅ Submit an idea in < 1 minute
✅ Get AI analysis in < 10 seconds
✅ Review and approve in < 30 seconds
✅ View all initiatives instantly
✅ Filter dashboard results instantly

## 🎯 Testing Scenarios

### Scenario 1: Happy Path
1. Submit a complete idea
2. Review AI analysis
3. Submit for approval
4. Approve from dashboard
5. Verify ADO ID created

### Scenario 2: Rejection Path
1. Submit an idea
2. Review AI analysis
3. Submit for approval
4. Reject with reason
5. Verify reason saved

### Scenario 3: Edit Path
1. Start submitting idea
2. Review AI analysis
3. Click "Edit"
4. Modify fields
5. Regenerate analysis
6. Submit

### Scenario 4: Dashboard Filter
1. Create multiple initiatives
2. Filter by "Pending"
3. Filter by "Approved"
4. Filter by "Rejected"
5. Filter by "All"

## 💡 Tips for Success

- ✅ Test with real-looking data
- ✅ Use different business values to test scoring
- ✅ Try edge cases (very long text, special characters)
- ✅ Test on different screen sizes
- ✅ Keep backend running during frontend dev
- ✅ Check both terminal outputs for errors
- ✅ Use Vue DevTools for debugging
- ✅ Keep sample data for reference

---

**Last Updated:** Project creation date
**Tested On:** Windows with PowerShell
**Node Version:** 16+
**Status:** ✅ All core features working
