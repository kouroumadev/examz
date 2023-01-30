<?php

namespace App\Http\Controllers;

use App\Events\AnnouncementCreated;
use App\Events\AnnouncementUpdated;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::query();

        if ($search = $request->input('search')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['title', 'like', '%' . $search . '%']]);
        }

        if ($branch = $request->input('branch')) {
            $query->whereHas('branches', function ($q) use ($branch) {
                    $q->join('branches as b', 'branch_id', '=', 'b.id')
                            ->where('b.name', 'like', '%' . $branch . '%');
                });
        }

        if ($status = $request->input('status')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['status', '=', $status]]);
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'title', 'status')
                    ->where('institute_id', auth()->user()->institute_id)
                    ->with(['branches' => function ($q) {
                        $q->join('branches as b', 'branch_id', '=', 'b.id')
                            ->select('b.name');
                    }])
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Announcement::select('id', 'title', 'sub_title', 'description', 'file')
                        ->where('id', $id)
                        ->with(['branches:id,name', 'batches:id,name'])
                        ->first();

        if (!$data) return $this->responseFailed('Announcement not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'branches' => 'required|array|min:1',
            'branches.*' => 'required|integer',
            'batches' => 'required|array|min:1',
            'batches.*' => 'required|integer',
            'title' => 'required|string',
            'sub_title' => 'required|string',
            'description' => 'required|string',
            'file' => 'nullable|mimes:jpeg,png,jpg,pdf,docx,doc,xlsx,xls,xml,pptx,ppt|max:2048',
            'status' => Rule::in(['published', 'draft']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($request->hasFile('file')) {
<<<<<<< HEAD

            $name = $request->file('file');
            $file = rand() . '.' . $name->getClientOriginalExtension();
            Storage::putFileAs('public/files', $request->file('file'), $file);
            Storage::disk('s3')->put($file, file_get_contents($name));


=======
            $file = rand() . '.' . $request->file->getClientOriginalExtension();
            Storage::putFileAs('public/files', $request->file('file'), $file);
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
        }

        $data = Announcement::create(array_merge(
            $validator->validated(),
            [
                'user_id' => auth()->user()->id,
                'institute_id' => auth()->user()->institute_id,
                'file' => $file ?? null,
            ]
        ));

<<<<<<< HEAD
         $data->branches()->attach($input['branches']);
         $data->batches()->attach($input['batches']);
=======
        $data->branches()->attach($input['branches']);
        $data->batches()->attach($input['batches']);
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

        AnnouncementCreated::dispatch($data);

        return $this->responseSuccess('Announcement successfully created', $data, 201);
    }

<<<<<<< HEAD
    public function presignedUpload(Request $request)
    {

        $s3 = Storage::disk('s3');
        $client = $s3->getDriver()->getAdapter()->getClient();
        $expiry = "+10 minutes";

        $cmd = $client->getCommand('PutObject', [
            'Bucket' => \Config::get('filesystems.disks.s3.bucket'),
            'Key' => 'path/to/file/' . $request->name,
            'ACL' => 'public-read',
        ]);

        $request = $client->createPresignedRequest($cmd, $expiry);

        $data = (string)$request->getUri();

        return $this->responseSuccess('Url successfully created', $data, 201);
    }

=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    public function update(Request $request, $id)
    {
        $announcement = Announcement::where('id', $id)->first();
        if (!$announcement) return $this->responseFailed('Announcement not found', '', 404);
        if ($announcement->status == 'published') return $this->responseFailed('Announcement has been published', '', 422);

        $input = $request->all();
        $validator = Validator::make($input, [
            'branches' => 'required|array|min:1',
            'branches.*' => 'required|integer',
            'batches' => 'required|array|min:1',
            'batches.*' => 'required|integer',
            'title' => 'required|string',
            'sub_title' => 'required|string',
            'description' => 'required|string',
            'file' => 'nullable|mimes:jpeg,png,jpg,pdf,docx,doc,xlsx,xls,xml,pptx,ppt|max:2048',
            'status' => Rule::in(['published', 'draft']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $oldFile = $announcement->file;
        if ($request->hasFile('file')) {
            if (Storage::exists('public/files/' . $oldFile)) {
                Storage::delete('public/files/' . $oldFile);
            }
            $file = rand() . '.' . $request->file->getClientOriginalExtension();
            Storage::putFileAs('public/files', $request->file('file'), $file);
        } else {
            $file = $oldFile;
        }

        $announcement->branches()->sync($input['branches']);
        $announcement->batches()->sync($input['batches']);

        $announcement->update(array_merge(
            $validator->validated(),
            [
                'file' => $oldFile,
            ]
        ));

        $data = Announcement::find($id);

        return $this->responseSuccess('Announcement successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $announcement = Announcement::where('id', $id)->first();
        if (!$announcement) return $this->responseFailed('Announcement not found', '', 404);

        if ($announcement->file) {
            if (Storage::exists('public/files/' . $announcement->file)) {
                Storage::delete('public/files/' . $announcement->file);
            }
        }

        $announcement->branches()->detach();
        $announcement->batches()->detach();

        $announcement->delete();

        return $this->responseSuccess('Announcement successfully deleted');
    }

    public function published($id)
    {
        $announcement = Announcement::where('id', $id)->first();
        if (!$announcement) return $this->responseFailed('Announcement not found', '', 404);
        if ($announcement->status == 'published') return $this->responseFailed('Announcement has been published', '', 422);

        $announcement->update(['status' => 'published']);

        return $this->responseSuccess('Announcement successfully published');
    }
}
<<<<<<< HEAD


=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
